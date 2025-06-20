import request from "supertest";
import express from "express";
import transcriptRouter from "../../src/routes/transcript.router";

// Mock the controller methods
jest.mock("../../src/controllers/transcript.controller", () => ({
    addTranscript: jest.fn((req, res) => res.status(201).json({ message: "Transcript added" })),
    updateTranscript: jest.fn((req, res) => res.status(200).json({ message: "Transcript updated" })),
    getTranscriptByStudentAndClass: jest.fn((req, res) => res.status(200).json({ message: "Transcript fetched successfully", transcript: { transcript_id: 1, student_id: 1, class_id: 1, grade: "8.50" } })),
}));

const app = express();
app.use(express.json());
app.use("/api/transcript", transcriptRouter);

describe("Transcript Router", () => {
    describe("POST /api/transcript", () => {
        it("should call addTranscript and return 201", async () => {
            const response = await request(app)
                .post("/api/transcript")
                .send({ studentId: "123", grades: [90, 80] });
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: "Transcript added" });
        });
    });

    describe("PUT /api/transcript/:id", () => {
        it("should call updateTranscript and return 200", async () => {
            const response = await request(app)
                .put("/api/transcript/1")
                .send({ grades: [95, 85] });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Transcript updated" });
        });
    });

    describe("GET /api/transcript/student/:studentId/class/:classId", () => {
        it("should call getTranscriptByStudentAndClass and return 200", async () => {
            const response = await request(app)
                .get("/api/transcript/student/1/class/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ 
                message: "Transcript fetched successfully", 
                transcript: { transcript_id: 1, student_id: 1, class_id: 1, grade: "8.50" } 
            });
        });
    });
});
