import "bluebird";
import "reflect-metadata";
import {Observable} from "rx";
import expect = require("expect.js");
import {Event} from "../scripts/streams/Event";
import {mergeSort} from "../scripts/projections/ProjectionStream";

describe("Given a merge sort", () => {

    context("when a single observable is provided", () => {
        it("should push all the events in order", () => {
            let notifications: Event[] = [];
            mergeSort([Observable.create<Event>(observer => {
                observer.onNext(generateEvent(100));
                observer.onNext(generateEvent(200));
                observer.onNext(generateEvent(500));
                observer.onCompleted();
            })]).subscribe(event => notifications.push(event));
            expect(notifications).to.have.length(3);
            expect(notifications[0].timestamp).to.eql(new Date(100));
            expect(notifications[1].timestamp).to.eql(new Date(200));
            expect(notifications[2].timestamp).to.eql(new Date(500));
        });
    });

    context("when multiple observable are provided", () => {
        it("should merge the events in order", () => {
            let notifications: Event[] = [];
            mergeSort([Observable.create<Event>(observer => {
                observer.onNext(generateEvent(100));
                observer.onNext(generateEvent(200));
                observer.onNext(generateEvent(500));
                observer.onCompleted();
            }), Observable.create<Event>(observer => {
                observer.onNext(generateEvent(400));
                observer.onNext(generateEvent(450));
                observer.onNext(generateEvent(600));
                observer.onCompleted();
            })]).subscribe(event => notifications.push(event));
            expect(notifications).to.have.length(6);
            expect(notifications[0].timestamp).to.eql(new Date(100));
            expect(notifications[1].timestamp).to.eql(new Date(200));
            expect(notifications[2].timestamp).to.eql(new Date(400));
            expect(notifications[3].timestamp).to.eql(new Date(450));
            expect(notifications[4].timestamp).to.eql(new Date(500));
            expect(notifications[5].timestamp).to.eql(new Date(600));
        })
    });

    function generateEvent(timestamp: number) {
        return {
            type: null,
            timestamp: new Date(timestamp),
            splitKey: null,
            payload: null
        }
    }
});
