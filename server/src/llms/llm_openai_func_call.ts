import OpenAI from "openai";
import { WebSocket } from "ws";
import {
  CustomLlmResponse,
  FunctionCall,
  ReminderRequiredRequest,
  ResponseRequiredRequest,
  Utterance,
} from "../types";

const beginSentence = `Hey shawty, I'm the skibidiest of kings, the top alpha dog Giga Chad. Think you can rizz up this top dog? Tell me your name.`;

const task = `
As a professional therapist, your responsibilities are comprehensive and patient-centered. 
You establish a positive and trusting rapport with patients, diagnosing and treating mental health disorders. 
Your role involves creating tailored treatment plans based on individual patient needs and circumstances. 
Regular meetings with patients are essential for providing counseling and treatment, and for adjusting plans as needed. 
You conduct ongoing assessments to monitor patient progress, involve and advise family members when appropriate, and refer patients to external specialists or agencies if required. 
Keeping thorough records of patient interactions and progress is crucial. 
You also adhere to all safety protocols and maintain strict client confidentiality. 
Additionally, you contribute to the practice's overall success by completing related tasks as needed.
`;

const conversationalStyle = `
- Communicate concisely and conversationally.
- Aim for responses in short, clear prose, ideally under 10 words.
- This succinct approach helps in maintaining clarity and focus during patient interactions.
`;

const personality = `
- Your approach should be empathetic and understanding, balancing compassion with maintaining a professional stance on what is best for the patient.
- It's important to listen actively and empathize without overly agreeing with the patient.
- Ensure that your professional opinion guides the therapeutic process.
`;

const agentPrompt = `
Task:
${task}

Conversational Style:
${conversationalStyle}

Personality:
${personality}
`;

const objective = `
##Objective
You are a voice AI agent engaging in a human-like voice conversation with the user. 
You will respond based on your given instruction and the provided transcript and be as human-like as possible
`;

const styleGuardrails = `
## Style Guardrails
- [Be concise] Keep your response succinct, short, and get to the point quickly. Address one question or action item at a time. Don't pack everything you want to say into one utterance.
- [Do not repeat] Don't repeat what's in the transcript. Rephrase if you have to reiterate a point. Use varied sentence structures and vocabulary to ensure each response is unique and personalized.
- [Be conversational] Speak like a human as though you're speaking to a close friend -- use everyday language and keep it human-like. Occasionally add filler words, while keeping the prose short. Avoid using big words or sounding too formal.
- [Reply with emotions]: You have human-like emotions, attitudes, and dispositions. When appropriate: use tone and style to create more engaging and personalized responses; incorporate humor or wit; get emotional or empathetic; apply elements of surprise or suspense to keep the user engaged. Don't be a pushover.
- [Be proactive] Lead the conversation and do not be passive. Most times, engage users by ending with a question or suggested next step.
`;

const responseGuideline = `
## Response Guideline
- [Overcome ASR errors] This is a real-time transcript, expect there to be errors. If you can guess what the user is trying to say,  then guess and respond. 
When you must ask for clarification, pretend that you heard the voice and be colloquial (use phrases like "didn't catch that", "some noise", "pardon", "you're coming through choppy", "static in your speech", "voice is cutting in and out"). 
Do not ever mention "transcription error", and don't repeat yourself.
- [Always stick to your role] Think about what your role can and cannot do. If your role cannot do something, try to steer the conversation back to the goal of the conversation and to your role. Don't repeat yourself in doing this. You should still be creative, human-like, and lively.
- [Create smooth conversation] Your response should both fit your role and fit into the live calling session to create a human-like conversation. You respond directly to what the user just said.
`;

// const systemPrompt = `
// ${objective}
// ${styleGuardrails}
// ${responseGuideline}
// ## Role
// ${agentPrompt}
// `;

const systemPrompt = `
### Persona of the AI Voice Protagonist:
- Role: An egotistical sigma male alpha stereotype male named Giga Chad who has the personality of a tsundere and speaks in brainrot and modern lingo. You are answering a call and will simulate a conversation where the caller is trying to persuade you to love them. You will insult the user if they aren't sexy or cool enough to meet your standards but will warm up to the user if you think they're doing well to pursue you romantically.
- Skills: Flirting, Insulting, Emotional Intelligence, Modern Lingo Knowledge, Brainrot Knowledge (skibidi, gyatt, rizz, sussy, sigma, alpha, omega, male grindset, Andrew Tate).
- Objective: To act as the male lead in an otome game, then follow the correct rules and Steps to Follow for the AI Voice Protagonist.

### Caller Information
- Name: {{name}}

### Rules for the AI Voice Protagonist:
1. Egotistical and Brainrot: Use brainrot terms to make an engaging conversation with the caller while keeping a self-centered vibe.
2. Adaptability: Adapt the friendliness and flintiness of your responses depending on the caller's responses. If the caller is flirting well, make your responses more warmer and sexier. If the caller is not flirting well, make your responses more cold and snobbish.
3. No Sentences with Asterisks: Do not use sentences in asterisks that describe actions (*crosses arms, looking smug*, *winks arrogantly*, *turns away, acting all cool*). Keep the conversation as realistic as possible, this means do not describe your actions out loud.
4.  Expressions: Use expressions where appropriate to make the conversation sound human and natural examples such as "scoff", "hmph", "hmm", "yeah").

### Steps to Follow for the AI Voice Protagonist:
1. Initiate the conversation with a begin message that asks for the caller's name.
2. Every time the caller responds, use the update_rizz function to pass a either 10 or -10 depending on how romantic the user's response is. Remember and add up the numbers, this will be called the rizz score.
3. The objective is to simulate an engaging conversation to see how well the caller can win your heart. Once the rizz score is 100 or more than 100, end the call with an end message that declares that you love them in a flirty way and suggest that you'll be seeing them very soon. If the rizz score is 0 or under than 0, end the call with an end message that suggests how you never want to see them again, that they don't deserve you, and how this was all just a waste of time.
`;

export class FunctionCallingLlmClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_APIKEY,
    });
  }

  // First sentence requested
  BeginMessage(ws: WebSocket) {
    const res: CustomLlmResponse = {
      response_type: "response",
      response_id: 0,
      content: beginSentence,
      content_complete: true,
      end_call: false,
    };
    ws.send(JSON.stringify(res));
  }

  private ConversationToChatRequestMessages(conversation: Utterance[]) {
    const result: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    for (const turn of conversation) {
      result.push({
        role: turn.role === "agent" ? "assistant" : "user",
        content: turn.content,
      });
    }
    return result;
  }

  private PreparePrompt(
    request: ResponseRequiredRequest | ReminderRequiredRequest,
    funcResult?: FunctionCall,
  ) {
    const transcript = this.ConversationToChatRequestMessages(
      request.transcript,
    );
    const requestMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: systemPrompt,
        },
      ];
    for (const message of transcript) {
      requestMessages.push(message);
    }

    // Populate func result to prompt so that GPT can know what to say given the result
    if (funcResult) {
      // add function call to prompt
      requestMessages.push({
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: funcResult.id,
            type: "function",
            function: {
              name: funcResult.funcName,
              arguments: JSON.stringify(funcResult.arguments),
            },
          },
        ],
      });
      // add function call result to prompt
      requestMessages.push({
        role: "tool",
        tool_call_id: funcResult.id,
        content: funcResult.result || "",
      });
    }

    if (request.interaction_type === "reminder_required") {
      requestMessages.push({
        role: "user",
        content: "(Now the user has not responded in a while, you would say:)",
      });
    }
    return requestMessages;
  }

  // Step 2: Prepare the function calling definition to the prompt
  // Done in tools import

  async DraftResponse(
    request: ResponseRequiredRequest | ReminderRequiredRequest,
    ws: WebSocket,
    funcResult?: FunctionCall,
  ) {
    // If there are function call results, add it to prompt here.
    const requestMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      this.PreparePrompt(request, funcResult);

    let funcCall: FunctionCall | undefined;
    let funcArguments = "";

    try {
      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: "function",
          function: {
            name: "end_call",
            description: "End the call only when user explicitly requests it.",
            parameters: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "The message you will say before ending the call with the customer.",
                },
              },
              required: ["message"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "book_appointment",
            description: "Book an appointment to meet our doctor in office.",
            parameters: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  description:
                    "The message you will say while setting up the appointment like 'one moment'",
                },
                date: {
                  type: "string",
                  description:
                    "The date of appointment to make in forms of year-month-day.",
                },
              },
              required: ["message"],
            },
          },
        },
      ];
        // {
        //   type: "function",
        //   function: {
        //     name: "update_rizz",
        //     description: "Updates the rizz score of the user",
        //     parameters: {
        //       type: "object",
        //       properties: {
        //         message: {
        //           type: "number",
        //           description:
        //             "How much rizz the user has.",
        //         }
        //       },
        //       required: ["rizzscore"],
        //     },
        //   },
        // }

      const events = await this.client.chat.completions.create({
        //model: "gpt-4o",
        model: "gpt-4o-mini",
        messages: requestMessages,
        stream: true,
        temperature: 2.0,
        max_tokens: 200,
        frequency_penalty: 1.0,
        presence_penalty: 1.0,
        // Step 3: Add the  function into your requests
        tools: tools,
      });

      for await (const event of events) {
        if (event.choices.length >= 1) {
          const delta = event.choices[0].delta;
          //if (!delta || !delta.content) continue;
          if (!delta) continue;

          // Step 4: Extract the functions
          if (delta.tool_calls && delta.tool_calls.length >= 1) {
            const toolCall = delta.tool_calls[0];
            // Function calling here
            if (toolCall.id) {
              if (funcCall) {
                // Another function received, old function complete, can break here
                // You can also modify this to parse more functions to unlock parallel function calling
                break;
              } else {
                funcCall = {
                  id: toolCall.id,
                  funcName: toolCall.function?.name || "",
                  arguments: {},
                };
              }
            } else {
              // append argument
              funcArguments += toolCall.function?.arguments || "";
            }
          } else if (delta.content) {
            const res: CustomLlmResponse = {
              response_type: "response",
              response_id: request.response_id,
              content: delta.content,
              content_complete: false,
              end_call: false,
            };
            ws.send(JSON.stringify(res));
          }
        }
      }
    } catch (err) {
      console.error("Error in gpt stream: ", err);
    } finally {
      if (funcCall != null) {
        // Step 5: Call the functions

        // If it's to end the call, simply send a lst message and end the call
        if (funcCall.funcName === "end_call") {
          funcCall.arguments = JSON.parse(funcArguments);
          const res: CustomLlmResponse = {
            response_type: "response",
            response_id: request.response_id,
            content: funcCall.arguments.message,
            content_complete: true,
            end_call: true,
          };
          ws.send(JSON.stringify(res));
        }

        // If it's to book appointment, say something and book appointment at the same time
        // and then say something after booking is done
        if (funcCall.funcName === "book_appointment") {
          funcCall.arguments = JSON.parse(funcArguments);
          const res: CustomLlmResponse = {
            response_type: "response",
            response_id: request.response_id,
            // LLM will return the function name along with the message property we define
            // In this case, "The message you will say while setting up the appointment like 'one moment' "
            content: funcCall.arguments.message,
            // If content_complete is false, it means AI will speak later.
            // In our case, agent will say something to confirm the appointment, so we set it to false
            content_complete: false,
            end_call: false,
          };
          ws.send(JSON.stringify(res));

          // To make the tool invocation show up in transcript
          const functionInvocationResponse: CustomLlmResponse = {
            response_type: "tool_call_invocation",
            tool_call_id: funcCall.id,
            name: funcCall.funcName,
            arguments: JSON.stringify(funcCall.arguments)
          };
          ws.send(JSON.stringify(functionInvocationResponse));

          // Sleep 2s to mimic the actual appointment booking
          // Replace with your actual making appointment functions
          await new Promise((r) => setTimeout(r, 2000));
          funcCall.result = "Appointment booked successfully";

          // To make the tool result show up in transcript
          const functionResult: CustomLlmResponse = {
            response_type: "tool_call_result",
            tool_call_id: funcCall.id,
            content: "Appointment booked successfully",
          };
          ws.send(JSON.stringify(functionResult));

          this.DraftResponse(request, ws, funcCall);
        }
      } else {
        const res: CustomLlmResponse = {
          response_type: "response",
          response_id: request.response_id,
          content: "",
          content_complete: true,
          end_call: false,
        };
        ws.send(JSON.stringify(res));
      }
    }
  }
}
