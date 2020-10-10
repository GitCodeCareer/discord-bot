const axios = require("axios");

jest.mock("axios");

async function getFirstQuote() {
  const response = await axios.get(
    "http://quotes.stormconsultancy.co.uk/random.json"
  );
  return response.data[0].quote;
}

const quote = ["CodeCareer", "RandomQuote", "QuoteOfTheDay", "Giphy", "Nasa"];

test("The quote command has CodeCareer on it", () => {
  expect(quote).toContain("CodeCareer");
  expect(new Set(quote)).toContain("CodeCareer");
});

test('There is a "CodeCareer.io" in https://CodeCareer.io', () => {
  expect("https://CodeCareer.io").toMatch(/CodeCareer.io/);
});

test("The HTTP response status code 301 Moved Permanently is used for permanent redirecting, meaning current links or records using the URL that the response is received for should be updated. The new URL should be provided in the Location field included with the response. The 301 redirect is considered a best practice for upgrading users from HTTP to HTTPS", () => {
  const value = Math.PI * 95.811275741321;
  expect(value).toBeGreaterThan(300);
  expect(value).toBeLessThan(302);

  // toBe and toEqual are equivalent for numbers
  expect(Math.PI * 95.811275741321).toBe(301);
  expect(value).toBe(301);
  expect(value).toEqual(301);
});

it("returns the quote of the first randomquote", async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        author: "C. A. R. Hoare",
        id: 1,
        quote:
          "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.",
      },
      {
        author: "Edward V Berard",
        id: 2,
        quote:
          "Walking on water and developing software from a specification are easy if both are frozen.",
      },
    ],
  });

  const quote = await getFirstQuote();
  expect(quote).toEqual(
    "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil."
  );
});
