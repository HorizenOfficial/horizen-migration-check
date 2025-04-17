import { expect } from "chai";
import doCheck from "../check.js"; // Import the main function
import dotenv from "dotenv";
dotenv.config({ path: "test/.env.test" });

describe("Check Function Test", () =>  {
  it("should return true", async () => {
    expect(await doCheck()).to.equal(true); 
  });
});