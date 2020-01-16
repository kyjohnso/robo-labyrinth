const Alexa = require('ask-sdk-core');
const Util = require('./util');
const Common = require('./common');

// The namespace of the custom directive to be sent by this skill
const NAMESPACE = 'Custom.Mindstorms.Gadget';

// The name of the custom directive to be sent this skill
const NAME_CONTROL = 'control';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle: async function(handlerInput) {

        let request = handlerInput.requestEnvelope;
        let { apiEndpoint, apiAccessToken } = request.context.System;
        let apiResponse = await Util.getConnectedEndpoints(apiEndpoint, apiAccessToken);
        if ((apiResponse.endpoints || []).length === 0) {
            return handlerInput.responseBuilder
            .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
            .getResponse();
        }

        // Store the gadget endpointId to be used in this skill session
        let endpointId = apiResponse.endpoints[0].endpointId || [];
        Util.putSessionAttribute(handlerInput, 'endpointId', endpointId);

        return handlerInput.responseBuilder
            .speak("Welcome, you can start issuing move commands")
            .reprompt("Awaiting commands")
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the MoveIntent request.
const MoveIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MoveIntent';
    },
    handle: function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const one = Alexa.getSlotValue(request, 'One');

        // All others are optional, use default if not available
        const two = Alexa.getSlotValue(request, 'Two') || "none";
        const three = Alexa.getSlotValue(request, 'Three') || "none";
        const four = Alexa.getSlotValue(request, 'Four') || "none";
        const five = Alexa.getSlotValue(request, 'Five') || "none";
        const six = Alexa.getSlotValue(request, 'Six') || "none";
        const seven = Alexa.getSlotValue(request, 'Seven') || "none";
        const eight = Alexa.getSlotValue(request, 'Eight') || "none";
        const nine = Alexa.getSlotValue(request, 'Nine') || "none";
        const ten = Alexa.getSlotValue(request, 'Ten') || "none";
        const a = Alexa.getSlotValue(request, 'A') || "1";
        const b = Alexa.getSlotValue(request, 'B') || "1";
        const c = Alexa.getSlotValue(request, 'C') || "1";
        const d = Alexa.getSlotValue(request, 'D') || "1";
        const e = Alexa.getSlotValue(request, 'E') || "1";
        const f = Alexa.getSlotValue(request, 'F') || "1";
        const g = Alexa.getSlotValue(request, 'G') || "1";
        const h = Alexa.getSlotValue(request, 'H') || "1";
        const i = Alexa.getSlotValue(request, 'I') || "1";
        const j = Alexa.getSlotValue(request, 'J') || "1";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = attributesManager.getSessionAttributes().endpointId || [];

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'move',
                1: one,
                2: two,
                3: three,
                4: four,
                5: five,
                6: six,
                7: seven,
                8: eight,
                9: nine,
                10: ten,
                a: a,
                b: b,
                c: c,
                d: d,
                e: e,
                f: f,
                g: g,
                h: h,
                i: i,
                j: j
            });

//        const speechOutput = `ok, doing ${one} then ${two} then ${three} then ${four} then ${five} then ${six} then ${seven} then ${eight} then ${nine} then ${ten}`;
        const speechOutput = `ok, here we go`;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt("awaiting command")
            .addDirective(directive)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        MoveIntentHandler,
        Common.HelpIntentHandler,
        Common.CancelAndStopIntentHandler,
        Common.SessionEndedRequestHandler,
        Common.IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(Common.RequestInterceptor)
    .addErrorHandlers(
        Common.ErrorHandler,
    )
    .lambda();
