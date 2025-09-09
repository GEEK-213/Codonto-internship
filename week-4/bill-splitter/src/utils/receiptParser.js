


const MockTogetherAI = {
  chat: {
    completions: {
      create: async ({ messages }) => {
        console.log("Mocking Together AI call with prompt:", messages[1].content);
        await new Promise(res => setTimeout(res, 1500)); // Simulate network delay
        return {
          choices: [{
            message: {
           
              content: JSON.stringify({
                items: [
                  { name: "PANEER BUTTER MASALA", price: 250.00 },
                  { name: "GARLIC NAAN", price: 75.00 },
                  { name: "JEERA RICE", price: 150.00 },
                  { name: "MINERAL WATER", price: 25.00 }
                ],
                total: 500.00,
              })
            }
          }]
        };
      }
    }
  }
};

const createPrompt = (text) => `
You are an intelligent receipt parsing assistant.
Extract the line items with their names and prices from the following receipt text.
The output should be a clean JSON object with a key "items" containing an array of objects, where each object has a "name" and a "price" (as a number).
Also extract the "total" amount if it is present.
Do not include items that are clearly not food or drink, like "GST", "CGST", "Total", "Subtotal", "Discount", or "Service Charge".
Only include the final JSON object in your response. Do not add any extra commentary.

Receipt Text:
---
${text}
---
`;

export const parseReceiptWithAI = async (text) => {
  if (!text) {
    return { items: [], total: 0 };
  }

  try {
    
    const response = await MockTogetherAI.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that only outputs valid JSON.' },
        { role: 'user', content: createPrompt(text) },
      ],
    });

    const jsonResponse = response.choices[0].message.content;
    const cleanedJson = jsonResponse.replace(/```json\n?|\n?```/g, '');
    const parsedData = JSON.parse(cleanedJson);

    if (!parsedData.items || !Array.isArray(parsedData.items)) {
      throw new Error("AI response did not contain a valid 'items' array.");
    }

    
    return {
      items: parsedData.items.map(item => ({
        name: String(item.name),
        price: Number(item.price)
      })).filter(item => item.name && !isNaN(item.price)),
      total: Number(parsedData.total) || parsedData.items.reduce((sum, item) => sum + Number(item.price), 0)
    };

  } catch (error) {
    console.error("Error parsing receipt with AI:", error);
    throw new Error("Could not understand the receipt. Please try a clearer image.");
  }
};
