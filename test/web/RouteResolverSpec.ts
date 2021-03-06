import "reflect-metadata";
import expect = require("expect.js");
import {IRouteResolver, IRequest, IRequestHandler} from "../../scripts/web/IRequestComponents";
import {
    MockRequestHandler, ParamRequestHandler,
    DuplicatedRequestHandler, ChannelRequestHandler
} from "../fixtures/web/MockRequestHandler";
import MockRequest from "../fixtures/web/MockRequest";
import RouteResolver from "../../scripts/web/RouteResolver";

describe("Given a RouteResolver and a new request", () => {
    let subject: IRouteResolver;
    let request: IRequest;
    let mockRequestHandler: IRequestHandler;
    let paramRequestHandler: IRequestHandler;

    beforeEach(() => {
        mockRequestHandler = new MockRequestHandler();
        paramRequestHandler = new ParamRequestHandler();
        request = new MockRequest();
        request.method = "GET";
        request.originalRequest = undefined;
        subject = new RouteResolver([mockRequestHandler, paramRequestHandler]);
    });

    context("when the request method matches", () => {
        context("and a specific handler exists for the request", () => {
            it("should return the handler", () => {
                request.url = "/test";
                let data = subject.resolve(request);
                expect(data[0]).to.be(mockRequestHandler);
            });

            context("when the url contains query string parameters", () => {
                it("should return the correct handler", () => {
                    request.url = "/test?foo=bar";
                    let data = subject.resolve(request);
                    expect(data[0]).to.be(mockRequestHandler);
                });
            });

            context("when the url contains url parameters", () => {
                it("should deserialize them", () => {
                    request.url = "/foo/f4587s";
                    let data = subject.resolve(request);
                    expect(data[0]).to.be(paramRequestHandler);
                    expect(data[1]).to.eql({
                        id: "f4587s"
                    });
                });
            });
        });

        context("and a duplicated request handler exists for the request", () => {
            beforeEach(() => {
                subject = new RouteResolver([mockRequestHandler, paramRequestHandler, new DuplicatedRequestHandler()]);
            });
            it("should pick the last", () => {
                request.url = "/test";
                let data = subject.resolve(request);

                expect((<any>data[0]).duplicated).to.be(true);
            });
        });

        context("and a specific handler does not exists for the request", () => {
            it("should not return an handler", () => {
                request.url = "/notfound";
                let data = subject.resolve(request);
                expect(data[0]).to.be(null);
            });
        });
    });

    context("when the request method does not match", () => {
        it("should not return an handler", () => {
            request.url = "/test";
            request.method = "POST";
            let data = subject.resolve(request);
            expect(data[0]).to.be(null);
        });
    });

    context("when the method is not specified", () => {
        it("should match the full url", () => {
            let requestHandler = new ChannelRequestHandler();
            subject = new RouteResolver([requestHandler]);
            request.url = "pgoat://readmodel/retrieve";
            let data = subject.resolve(request);
            expect(data[0]).to.be(requestHandler);

        });
    });
});
