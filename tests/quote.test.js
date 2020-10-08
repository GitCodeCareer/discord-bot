const axios = require('axios');

jest.mock('axios');

async function getFirstQuote() {
    const response = await axios.get('http://quotes.stormconsultancy.co.uk/random.json');
    return response.data[0].quote;
}

const quote = [
    'CodeCareer',
    'RandomQuote',
    'QuoteOfTheDay',
    'Giphy',
    'Nasa',
];

test('The quote command has CodeCareer on it', () => {
    expect(quote).toContain('CodeCareer');
    expect(new Set(quote)).toContain('CodeCareer');
});

test('There is a "https" in CodeCareer', () => {
    expect('https://CodeCareer.io').toMatch(/https/);
});

test('The Ultimate Question of Life, the Universe and Everything', () => {
    const value = 6 + 6 + 6 + 6 + 6 + 6 + 6;
    expect(value).toBeGreaterThan(41);
    expect(value).toBeLessThan(43);

    // toBe and toEqual are equivalent for numbers
    expect(21 + 21).toBe(42);
    expect(value).toBe(42);
    expect(value).toEqual(42);
});

it('returns the quote of the first randomquote', async () => {
    axios.get.mockResolvedValue({
        data: [
            {
                author: 'C. A. R. Hoare',
                id: 1,
                quote: 'We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.'
            },
            {
                author: 'Edward V Berard',
                id: 2,
                quote: 'Walking on water and developing software from a specification are easy if both are frozen.'
            }
        ]
    });

    const quote = await getFirstQuote();
    expect(quote).toEqual('We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil.');
});