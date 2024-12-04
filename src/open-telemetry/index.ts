import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { Resource } from "@opentelemetry/resources";
import { Span } from "@opentelemetry/api";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { IUser } from "stores/ims/interfaces";

const resourceSettings = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "tailorbird-webv2",
});

const otlpExporter = new OTLPTraceExporter({
    url: "/tempo-exporter",
});

const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");

const provider = new WebTracerProvider({ resource: resourceSettings });

provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

provider.register({
    contextManager: new ZoneContextManager(),
});

const startOtelInstrumentation = () => {
    return registerInstrumentations({
        instrumentations: [
            new FetchInstrumentation({
                ignoreUrls: [new RegExp(`${process.env.REACT_APP_BASE_URL}`)],
                propagateTraceHeaderCorsUrls: [
                    new RegExp(`${process.env.REACT_APP_APP_APOLLO_SERVER_URL}`),
                ],
                clearTimingResources: true,
                applyCustomAttributesOnSpan: (span: Span, request: any) => {
                    if (request && request.body) {
                        try {
                            const parsedBody = JSON.parse(request.body);
                            parsedBody &&
                                parsedBody.operationName &&
                                span.setAttribute(
                                    "graphql.operationName",
                                    parsedBody.operationName,
                                );
                            parsedBody &&
                                parsedBody.query &&
                                span.setAttribute("graphql.query", parsedBody.query);
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                        span.setAttribute("request.body", request.body);
                    }

                    const screenWidth = window.screen.width;
                    const screenHeight = window.screen.height;
                    span.setAttribute("window.screen.width", screenWidth);
                    span.setAttribute("window.screen.height", screenHeight);
                    email && span.setAttribute("user.email", email);
                },
            }),
        ],
    });
};

const getTracer = () => {
    return provider.getTracer("web-tracer");
};

export { startOtelInstrumentation, getTracer };
