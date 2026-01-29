import { Functions } from "objectiveai";
import { ExampleInput } from "./example_input";

export const Function: Functions.RemoteFunction = {
  "type": "scalar.function",
  "description": "Keyword-based Relevance Scoring. Discover how relevant a piece of content is to specific keywords. Joins each keyword and executes a single Vector Completion Task.",
  "input_schema": {
    "type": "object",
    "properties": {
      "keywords": {
        "type": "array",
        "description": "Keywords to evaluate relevance against.",
        "minItems": 1,
        "items": {
          "type": "string",
          "description": "A keyword to evaluate relevance against."
        }
      },
      "content": {
        "anyOf": [
          {
            "type": "string",
            "description": "Text content to be evaluated for relevance."
          },
          {
            "type": "image",
            "description": "Image content to be evaluated for relevance."
          },
          {
            "type": "video",
            "description": "Video content to be evaluated for relevance."
          },
          {
            "type": "audio",
            "description": "Audio content to be evaluated for relevance."
          },
          {
            "type": "file",
            "description": "File content to be evaluated for relevance."
          },
          {
            "type": "array",
            "description": "Array of content pieces to be evaluated for relevance.",
            "minItems": 1,
            "items": {
              "anyOf": [
                {
                  "type": "string",
                  "description": "Text content to be evaluated for relevance."
                },
                {
                  "type": "image",
                  "description": "Image content to be evaluated for relevance."
                },
                {
                  "type": "video",
                  "description": "Video content to be evaluated for relevance."
                },
                {
                  "type": "audio",
                  "description": "Audio content to be evaluated for relevance."
                },
                {
                  "type": "file",
                  "description": "File content to be evaluated for relevance."
                }
              ]
            }
          }
        ]
      }
    },
    "required": ["keywords", "content"]
  },
  "tasks": [
    {
      "type": "vector.completion",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": {
                "$jmespath": "join('',['How relevant is the following content with regards to:\n- ',join('\n- ',input.keywords),'\n\n\"'])"
              }
            },
            {
              "$jmespath": "input_value_switch(input.content,`null`,&[].input_value_switch(@,`null`,`null`,&{type:'text',text:@},`null`,`null`,`null`,@,@,@,@),&{type:'text',text:@},`null`,`null`,`null`,input.content,input.content,input.content,input.content)"
            },
            {
              "type": "text",
              "text": "\""
            }
          ]
        }
      ],
      "responses": ["Extremely Relevant", "Somewhat Relevant", "Not Relevant"]
    }
  ],
  "output": {
    "$jmespath": "add(tasks[0].scores[0],multiply(tasks[0].scores[1],`0.5`))"
  }
};

export const Profile: Functions.RemoteProfile = {
  "description": "The default profile for `WiggidyW/keyword-relevance-joined`. Reasoning models have higher weight. Supports multi-modal content.",
  "tasks": [
    {
      "ensemble": {
        "llms": [
          {
            "model": "openai/gpt-4.1-nano",
            "output_mode": "json_schema"
          },
          {
            "model": "openai/gpt-4.1-nano",
            "output_mode": "json_schema",
            "temperature": 0.75
          },
          {
            "model": "openai/gpt-4.1-nano",
            "output_mode": "json_schema",
            "temperature": 1.25
          },
          {
            "model": "google/gemini-2.5-flash-lite",
            "output_mode": "json_schema"
          },
          {
            "model": "google/gemini-3-flash-preview",
            "output_mode": "json_schema"
          },
          {
            "model": "x-ai/grok-4.1-fast",
            "output_mode": "json_schema",
            "temperature": 0.75,
            "reasoning": {
              "enabled": false
            }
          },
          {
            "model": "x-ai/grok-4.1-fast",
            "output_mode": "json_schema",
            "temperature": 1.25,
            "reasoning": {
              "enabled": false
            }
          },
          {
            "model": "anthropic/claude-haiku-4.5",
            "output_mode": "instruction"
          },
          {
            "count": 3,
            "model": "deepseek/deepseek-v3.2",
            "output_mode": "instruction",
            "top_logprobs": 20
          },
          {
            "model": "google/gemini-2.5-flash-lite",
            "output_mode": "json_schema",
            "temperature": 0.75
          },
          {
            "model": "openai/gpt-5-mini",
            "output_mode": "json_schema"
          },
          {
            "model": "google/gemini-2.5-flash-lite",
            "output_mode": "json_schema",
            "temperature": 1.25
          },
          {
            "count": 3,
            "model": "openai/gpt-4o-mini",
            "output_mode": "json_schema",
            "top_logprobs": 20
          },
          {
            "model": "x-ai/grok-4.1-fast",
            "output_mode": "json_schema",
            "reasoning": {
              "enabled": false
            }
          }
        ]
      },
      "profile": [
        0.2, 0.2, 0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2, 0.2
      ]
    }
  ]
};

export const ExampleInputs: ExampleInput[] = [
  {
    value: {
      keywords: ["software engineering", "agile methodology"],
      content: "Our team implements two-week sprints with daily standups. We use JIRA for backlog management and conduct retrospectives after each iteration to continuously improve our development process."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["marine biology", "ocean conservation"],
      content: "My cat knocked over the fishbowl again yesterday. Had to scoop poor Bubbles off the carpet. That little orange tabby is always causing trouble around the house!"
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["electric vehicles", "sustainability"],
      content: "The new model features regenerative braking which captures kinetic energy during deceleration. However, it also comes in a stunning gasoline variant for those who prefer traditional powertrains."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["baking", "desserts", "chocolate"],
      content: "FOR SALE: vintage wooden dresser, oak finish, three drawers, minor scratches on top surface. Pick up only. $150 OBO. Text 555-0123 if interested."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["meditation", "mindfulness"],
      content: "ya so like... idk if this counts but sometimes when im waiting 4 the bus i just zone out n stare at nothing?? my brain goes completely blank lol is that basically the same thing???"
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["cybersecurity", "data protection"],
      content: "ABSTRACT: This paper presents a novel approach to AES-256 encryption key management in distributed cloud environments. We demonstrate a 47% reduction in latency while maintaining FIPS 140-2 compliance across all tested configurations."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["ancient Rome", "gladiators"],
      content: "The restaurant serves amazing spaghetti carbonara. Their tiramisu is to die for! Located on 5th avenue, open till midnight on weekends. Highly recommend making reservations."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["jazz music", "improvisation"],
      content: "Miles Davis revolutionized the genre with Kind of Blue in 1959. The album's modal approach gave musicians unprecedented freedom to explore melodic possibilities outside traditional chord progressions."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["astronomy", "black holes"],
      content: "The well at the edge of grandfather's property was always dark and seemed bottomless. We'd drop stones and count seconds, but never heard them land. Some mysteries are better left unexplored."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  {
    value: {
      keywords: ["venture capital", "startups"],
      content: "seed round closed @ 2.3M, 18mo runway, targeting series A by Q4. burn rate ~140k/mo. ARR hitting 850k w/ 12% MoM growth. cap table clean, no participating preferred."
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
];
