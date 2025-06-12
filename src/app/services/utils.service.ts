import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root', // This makes the service available globally
})
export class UtilsServices {
    constructor() {}

    /**
     * Deep equality check for objects and arrays.
     * @param obj1 - First object to compare
     * @param obj2 - Second object to compare
     * @returns boolean - true if objects are deeply equal, false otherwise
     */
    deepEqual(obj1: any, obj2: any): boolean {
        // If both are the same object, return true
        if (obj1 === obj2) return true;

        // If either is null or not an object, return false
        if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }

        // Get the keys of both objects
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // If the number of keys is different, the objects are not equal
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Check each key-value pair recursively
        for (const key of keys1) {
            // Check if the key exists in both objects
            if (!keys2.includes(key)) {
                return false;
            }

            // Recursively compare values of the key
            if (!this.deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        // If all tests pass, the objects are equal
        return true;
    }

    nestedUrlHandler(url: string, textToRemove: string): string {
        return url?.replace(textToRemove, '');
    }
}
