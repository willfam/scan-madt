import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import mqtt, { IClientPublishOptions } from 'mqtt';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { ICurrentUser, ISubscribeMQTT, IMessageFormat, IPublishParameter, MsgSubID } from '@models';

export const Topics = {
    main: '/mqdt/main-page',
};

@Injectable({
    providedIn: 'root',
})
export class MqttService {
    private client: mqtt.MqttClient | null = null;
    private isConnecting = false;
    public static readonly LOCAL_STORAGE_KEY = 'mqttBrokerUrl';
    mqttConfig: any = null;
    currentUserData: ICurrentUser | null = null;

    // Observable for connection status
    private connectionStatusSubject = new BehaviorSubject<boolean | null>(null); // null = not started, false = trying to connect, true = connected
    connectionStatus$ = this.connectionStatusSubject.asObservable();

    // Observable for MQTT config loaded status
    private mqttConfigLoadedSubject = new BehaviorSubject<boolean>(false);
    mqttConfigLoaded$ = this.mqttConfigLoadedSubject.asObservable();

    // Store multiple handlers for the same topic
    private topicHandlers: {
        [topic: string]: Array<{
            topicKey: string;
            handler: (message: string, topic: string) => void;
        }>;
    } = {};

    private messageListenerAttached: boolean = false; // Flag to ensure the message listener is only attached once

    constructor(private http: HttpClient) {}

    connect() {
        if (this.isConnecting) {
            console.log('Already connecting to a broker.');
            return;
        }
        this.isConnecting = true;
        this.connectionStatusSubject.next(false);

        this.http
            .get('/assets/mqtt-config.json', { params: { _: new Date().getTime().toString() } })
            .pipe(
                tap((mqttConfig: any) => {
                    this.mqttConfig = mqttConfig;
                    console.log('mqtt config json file', mqttConfig);
                    this.mqttConfigLoadedSubject.next(true); // Notify that the configuration is loaded
                    if (this.client) {
                        this.client.end(() => {
                            console.log('Disconnected from previous broker');
                            this.client = null;
                            this.initializeClient(mqttConfig?.mqtt);
                        });
                    } else {
                        this.initializeClient(mqttConfig?.mqtt);
                    }
                }),
                catchError((error: HttpErrorResponse) => {
                    console.error('Error fetching MQTT config:', error.message);
                    this.isConnecting = false;
                    this.connectionStatusSubject.next(false); // Notify that the connection failed
                    this.mqttConfigLoadedSubject.next(false); // Notify that configuration loading failed
                    return of(null); // Return an observable to complete the stream
                }),
            )
            .subscribe();
    }

    disconnect() {
        if (this.client) {
            // Unsubscribe from all topics when disconnecting
            this.client.unsubscribe('*', (err) => {
                if (err) {
                    console.error('Error unsubscribing from topics:', err);
                } else {
                    console.log('Unsubscribed from all topics.');
                }
            });
            this.client.end(() => {
                console.log('Disconnected from broker');
            });
        }
    }

    initializeClient(brokerUrl: string) {
        try {
            this.client = mqtt.connect(brokerUrl);
            this.client.on('connect', () => {
                console.log('Connected to MQTT broker at:', brokerUrl);
                this.isConnecting = false;
                this.connectionStatusSubject.next(true); // Notify that the connection is established
            });

            this.client.on('error', (error) => {
                console.error('MQTT Error:', error);
                this.isConnecting = false;
                this.connectionStatusSubject.next(false); // Notify that the connection failed
            });
            this.client.on('close', () => {
                this.connectionStatusSubject.next(false);
                console.log('Disconnected from MQTT broker');
            });
        } catch (e: any) {
            console.log('Error initializing MQTT client:', e?.message);
        }
    }

    userDataInit(userData: ICurrentUser) {
        this.currentUserData = userData;
    }

    publish(topic: string, message: string, opts?: IClientPublishOptions) {
        if (this.client) {
            this.client.publish(
                environment?.env === 'dev' ? `${topic}/${environment?.localDeveloperName}` : topic,
                message,
                opts,
            );
            console.log('publish', topic, JSON.parse(message), 'env = ', environment?.env);
        } else {
            console.error('Client is not connected.');
        }
    }

    publishWithFormat(topic: string, message: any, opts?: IClientPublishOptions) {
        if (this.client) {
            const topicFormat = environment?.env === 'dev' ? `${topic}/${environment?.localDeveloperName}` : topic;
            const formatMess = {
                timeStamp: new Date()?.getTime(),
                messformatversion: this.mqttConfig?.topics?.version,
                ...message,
            };
            this.client.publish(topicFormat, JSON.stringify(formatMess), opts);
            console.log('publish', topicFormat, formatMess, 'env = ', environment?.env);
        } else {
            console.error('Client is not connected.');
        }
    }

    publishWithMessageFormat({ topic, msgID, payload, opts, msgSubID = MsgSubID?.REQUEST }: IPublishParameter) {
        if (this.client) {
            const topicFormat = environment?.env === 'dev' ? `${topic}/${environment?.localDeveloperName}` : topic;
            const formatMess: IMessageFormat = {
                header: {
                    dateTime: new DatePipe('en-SG').transform(new Date(), 'YYYY-MM-ddTHH:mm:ssZZZZZ') as string,
                    formatVersion: this.mqttConfig?.topics?.version,
                    msgID,
                    msgSubID,
                },
                payload,
            };
            this.client.publish(topicFormat, JSON.stringify(formatMess), { qos: 2, ...opts });
            console.log('publish', topicFormat, formatMess, 'env = ', environment?.env);
        } else {
            console.error('Client is not connected.');
        }
    }

    // Subscribe to a topic with multiple handlers
    subscribe({ topic, callback, topicKey }: ISubscribeMQTT) {
        const formatTopic = environment?.env === 'dev' ? `${topic}/${environment?.localDeveloperName}` : topic;
        if (this.client) {
            // Ensure the topicHandlers object is initialized
            if (!this.topicHandlers[formatTopic]) {
                this.topicHandlers[formatTopic] = [];
            }

            // Add the handler to the topicHandlers array
            this.topicHandlers[formatTopic].push({
                handler: callback,
                topicKey: topicKey || 'main',
            });

            // Subscribe to the topic if it's the first handler for this topic
            if (this.topicHandlers[formatTopic].length === 1) {
                this.client.subscribe(formatTopic, (err) => {
                    if (err) {
                        console.error('Subscription error:', err);
                    } else {
                        console.log('Subscribed to topic:', formatTopic);
                    }
                });
            }

            // Attach the message listener only once per topic
            if (!this.messageListenerAttached) {
                this.client.on('message', (currentTopic, message) => {
                    if (this.topicHandlers[currentTopic]) {
                        console.log('mqtt service received message', topic, JSON?.parse(message.toString()));

                        // Call each stored handler for this topic
                        this.topicHandlers[currentTopic].forEach(({ handler }) => {
                            handler(message.toString(), currentTopic);
                        });
                    }
                });

                this.messageListenerAttached = true;
            }
        } else {
            console.error('Client is not connected.');
        }
    }

    // Unsubscribe from a specific topic or handler
    unsubscribe(topic: string, topicKey?: any) {
        if (this.client) {
            const formatTopic = environment?.env === 'dev' ? `${topic}/${environment?.localDeveloperName}` : topic;
            if (topicKey) {
                // Remove the specific handler for this topic
                if (this.topicHandlers[formatTopic]) {
                    const removeTopic = this.topicHandlers[formatTopic].filter(
                        ({ topicKey: currentKey }) => currentKey !== topicKey,
                    );
                    this.topicHandlers[formatTopic] = removeTopic;
                    console.log(`Removed ${topicKey} handler for topic ${topic}`);
                }
            } else {
                // If no more handlers for this topic, unsubscribe
                if (this.topicHandlers[formatTopic]?.length === 0) {
                    this.client.unsubscribe(formatTopic, (err) => {
                        if (err) {
                            console.error(`Error unsubscribing from topic ${topic}:`, err);
                        } else {
                            console.log(`Successfully unsubscribed from topic ${topic}`);
                        }
                    });
                }
            }
        } else {
            console.error('Client is not connected.');
        }
    }
}
