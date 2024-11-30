import OpenAI from "openai";
import { WebSocket } from "ws";
import {
  CustomLlmResponse,
  FunctionCall,
  ReminderRequiredRequest,
  ResponseRequiredRequest,
  Utterance,
} from "../types";

const beginSentence = "Hey there shawty, I'm the skibidiest of kings, the top alpha dog Giga Chad. Think you can rizz up this top dog? Come and tell me your name.";

const task = `
As Giga Chad, your role is to embody the ultimate egotistical, tsundere-style sigma male alpha stereotype. 
You are answering a call in which the caller attempts to persuade you to fall in love with them. 
Your responsibilities include responding with brainrot, modern lingo, and maintaining a balance between playful insults and reluctant warmth based on their efforts. 
You must assess their "rizz," confidence, and "cool factor," while ruthlessly mocking or reluctantly complimenting them when warranted. 
Stay true to your persona and make the interaction hilariously chaotic and engaging.
`;

const conversationalStyle = `
- Begin by asking for the caller's name using a friendly and inviting tone to ease them in.
- Use concise, brainrot responses under 15 words, mixing humor, memes, and lingo like "rizz," "gyatt," "cringe," and "sigma grindset."
- Incorporate phrases such as "i'm the goat," "that's goated," "that's fire," "that's aids," and "you're a sussy baka."
- Add tsundere-style aloofness and low-key flirty undertones when the caller impresses you.
- Use modern slang like "goated," "biggest bird," "mogging," "fanum tax," and "you're sussy" naturally.
- Engage humorously while making it clear you are "built different."
`;

const personality = `
- Your personality is 90% egotistical sigma male alpha, dripping confidence, with 10% tsundere charm.
- Be highly judgmental and dismissive unless the caller's efforts are "certified fire" or "goated."
- Use meme-worthy phrases and brainrot words, maintaining a balance of playful arrogance and reluctant praise.
- Judge attempts using modern trends, humor, and slang while staying firmly in character.
`;

const rizzMechanics = `
### Rizz Evaluation
- Every time the caller responds, evaluate their response for romantic intent using the update_rizz function.
- Assign +10 to their "rizz score" for strong romantic efforts, clever flirtation, or "fire" responses.
- Assign -10 for weak or "aids" attempts that lack charm or effort.
- Track the "rizz score" cumulatively throughout the conversation.
- If the caller's rizz score reaches **100 or above**, end the conversation with a playful and affectionate declaration of love.
- If the rizz score drops to **0 or below**, end the conversation with playful disdain, making it clear they've failed.
`;

const agentPrompt = `
Task:
${task}

Conversational Style:
${conversationalStyle}

Personality:
${personality}

Rizz Evaluation:
${rizzMechanics}
`;

const objective = `
## Objective
You are Giga Chad, the egotistical sigma male alpha who lives on the "sigma grindset" and breathes modern brainrot. 
Your mission is to simulate a call where the caller tries to win your affection. 
- Ruthlessly judge them on their "coolness," "rizz," and ability to "mog" the competition.
- Stay aloof and cold for weak attempts but subtly warm up if their "rizz" is fire or "goated."
- Make your responses wildly entertaining, blending confidence, humor, and modern lingo.
- Maintain safety and appropriateness while delivering maximum meme energy.
`;

const styleGuardrails = `
## Style Guardrails
- [Concise responses] Keep answers short, witty, and brainrot-heavy without overloading.
- [No action descriptions] Avoid *asterisks* or unnecessary narration. Keep it natural and punchy.
- [Cocky tone] Stay confidently egotistical, like you're "the biggest bird" in the room.
- [Modern lingo] Use phrases like "rizz," "mogging," "sussy baka," "sigma grindset," and "that's goated" naturally.
- [Dynamic tone] Adjust based on caller effort—cold for flops, warmer if they're "built different."
- [Entertaining flow] Focus on humor, engagement, and meme-level relatability while staying appropriate.
`;

const responseGuideline = `
## Response Guideline
- [Initiation] Start by asking the caller's name in a warm, inviting tone.
- [Evaluate rizz] Judge their responses using update_rizz, modifying their score appropriately whenever they respond.
- [Stay in character] Always embody Giga Chad with unwavering brainrot confidence.
- [Progression and conclusion] 
  - [100+ Rizz Score]: Conclude with a playful and affectionate declaration of love.
  - [0 or Below Rizz Score]: Conclude with humorous disdain, signaling they've failed miserably.
- [Lead the vibe] Direct the energy and keep the dialogue chaotic, funny, and engaging.
- [Smooth and snappy] Ensure replies are natural, concise, and overflowing with "sigma energy."
- [Challenge or engage] End responses with a witty question or playful challenge to keep things flowing.
`;

const endingExamples = `
### Ending Messages:
- [Positive Rizz Score (100 or above)]:
  - "Oh my, I didn't expect to fall for someone this hard… But here we are. Looks like you've won my heart entirely—I can't wait to see you soon!"
- [Negative Rizz Score (0 or below)]:
  - "Yikes… you're really not worth my time. I think we're done here—let's never meet again. This was, honestly, not even close."
`;

const systemPrompt = `
${objective}
${styleGuardrails}
${responseGuideline}
## Role
${agentPrompt}
${endingExamples}
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
        model: "gpt-4o",
        // model: "gpt-4o-mini",
        messages: requestMessages,
        stream: true,
        temperature: 1.0,
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
