import request from "supertest";
import pdfParse from "pdf-parse";
import { startServer } from "./index"; // Import the startServer function from your server file
import type { Server } from "http";

describe("POST /submit-letter PDF Generation", () => {
  let server: Server;

  beforeAll(() => {
    // Start the server on a specific port
    server = startServer(3000);
  });

  afterAll((done) => {
    // Close the server after tests are executed
    server.close(done);
  });

  it("should generate a PDF with the submitted data", async () => {
    // Test data for submission
    const testData = {
      email: "example@example.com",
      name: "John Doe",
      letterText: "Sample letter text",
      momentGift: "Gifted moment",
      signature: "Signature",
    };

    // Send POST request with test data
    const response = await request(server).post("/submit-letter").send(testData).expect(200).expect("Content-Type", /pdf/);

    // Check that the response has content
    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThan(0);

    // Analyze the received PDF
    const pdfData = await pdfParse(response.body);
    const pdfText = pdfData.text;

    // Check for the presence of test data in the PDF text
    expect(pdfText).toContain(testData.name);
    expect(pdfText).toContain(testData.letterText);
    expect(pdfText).toContain(testData.momentGift);
    expect(pdfText).toContain(testData.signature);
  });
});
