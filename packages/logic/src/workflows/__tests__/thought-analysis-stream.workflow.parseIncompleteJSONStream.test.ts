import { parseIncompleteJSONStream } from '../thought-analysis-stream.workflow'

describe('parseIncompleteJSONStream', () => {
  // 1. Complete valid JSON
  it('parses a complete valid object', () => {
    expect(parseIncompleteJSONStream('{"a":1,"b":2}')).toEqual({ a: 1, b: 2 })
  })
  it('parses a complete valid array', () => {
    expect(parseIncompleteJSONStream('[1,2,3]')).toEqual([1, 2, 3])
  })
  it('parses a complete valid string', () => {
    expect(parseIncompleteJSONStream('"foo"')).toBe('foo')
  })
  it('parses a complete valid number', () => {
    expect(parseIncompleteJSONStream('42')).toBe(42)
  })
  it('parses a complete valid boolean', () => {
    expect(parseIncompleteJSONStream('true')).toBe(true)
  })
  it('parses a complete valid null', () => {
    expect(parseIncompleteJSONStream('null')).toBe(null)
  })

  // 2. Incomplete object
  it('patches and parses an object missing closing brace', () => {
    expect(parseIncompleteJSONStream('{"a":1,"b":2')).toEqual({ a: 1, b: 2 })
  })

  // 3. Incomplete array
  it('patches and parses an array missing closing bracket', () => {
    expect(parseIncompleteJSONStream('[1,2,3')).toEqual([1, 2, 3])
  })

  // 4. Nested incomplete structures
  it('patches and parses nested incomplete object/array', () => {
    expect(parseIncompleteJSONStream('{"a":[1,2,{"b":3')).toEqual({ a: [1, 2, { b: 3 }] })
  })

  // 5. Unclosed string
  it('patches and parses an object with an unclosed string', () => {
    expect(parseIncompleteJSONStream('{"a":"foo')).toEqual({ a: 'foo' })
  })

  // 6. Escaped quotes in strings
  it('parses object with escaped quote in string', () => {
    expect(parseIncompleteJSONStream('{"a":"foo\\"bar"}')).toEqual({ a: 'foo"bar' })
  })
  it('patches and parses object with escaped quote and unclosed string', () => {
    expect(parseIncompleteJSONStream('{"a":"foo\\"bar')).toEqual({ a: 'foo"bar' })
  })

  // 7. Trailing comma
  it('removes trailing comma in object', () => {
    expect(parseIncompleteJSONStream('{"a":1,}')).toEqual({ a: 1 })
  })
  it('removes trailing comma in array', () => {
    expect(parseIncompleteJSONStream('[1,2,]')).toEqual([1, 2])
  })

  // 8. Multiple/nested trailing commas
  it('removes nested trailing commas', () => {
    expect(parseIncompleteJSONStream('{"a":[1,2,],}')).toEqual({ a: [1, 2] })
  })

  // 9. Mismatched close
  it('returns null for mismatched close', () => {
    expect(parseIncompleteJSONStream('{"a":1]]')).toBeNull()
  })

  // 10. Empty string
  it('returns null for empty string', () => {
    expect(parseIncompleteJSONStream('')).toBeNull()
  })

  // 11. Whitespace only
  it('returns null for whitespace only', () => {
    expect(parseIncompleteJSONStream('   \n\t')).toBeNull()
  })

  // 12. Invalid JSON
  it('returns null for invalid JSON', () => {
    expect(parseIncompleteJSONStream('{a:1}')).toBeNull()
  })

  // 13. Partial number
  it('returns null for partial number', () => {
    expect(parseIncompleteJSONStream('{"a": 1')).toEqual({ a: 1 })
    expect(parseIncompleteJSONStream('{"a": 1.')).toBeNull()
  })

  // 14. Partial boolean/null
  it('returns null for partial boolean', () => {
    expect(parseIncompleteJSONStream('{"a": tru')).toBeNull()
    expect(parseIncompleteJSONStream('{"a": fa')).toBeNull()
    expect(parseIncompleteJSONStream('{"a": nul')).toBeNull()
  })

  // 15. Array of objects, incomplete last object
  it('patches and parses array of objects with incomplete last object', () => {
    expect(parseIncompleteJSONStream('[{"a":1},{"b":2')).toEqual([{ a: 1 }, { b: 2 }])
  })

  // 16. Deeply nested incomplete
  it('patches and parses deeply nested incomplete JSON', () => {
    expect(parseIncompleteJSONStream('{"a":[{"b":[1,2,{"c":3')).toEqual({ a: [{ b: [1, 2, { c: 3 }] }] })
  })

  // 17. String with escaped backslash at end
  it('parses string with escaped backslash at end', () => {
    expect(parseIncompleteJSONStream('{"a":"foo\\\\"}')).toEqual({ a: 'foo\\' })
  })

  // 18. String with unicode escape
  it('parses string with unicode escape', () => {
    expect(parseIncompleteJSONStream('{"a":"\\u1234"}')).toEqual({ a: '\u1234' })
  })

  // 19. String with escaped newline/tab
  it('parses string with escaped newline and tab', () => {
    expect(parseIncompleteJSONStream('{"a":"foo\\nbar\\t"}')).toEqual({ a: 'foo\nbar\t' })
  })

  // 20. Already valid JSON (should not modify)
  it('does not modify already valid JSON', () => {
    expect(parseIncompleteJSONStream('{"a":1}')).toEqual({ a: 1 })
  })

  // 21. Unclosed string inside array/object
  it('patches and parses array with unclosed string', () => {
    expect(parseIncompleteJSONStream('["foo')).toEqual(['foo'])
  })
  it('patches and parses object with unclosed string value', () => {
    expect(parseIncompleteJSONStream('{"a":"bar')).toEqual({ a: 'bar' })
  })

  // 22. Unclosed array inside object
  it('patches and parses object with unclosed array', () => {
    expect(parseIncompleteJSONStream('{"a":[1,2')).toEqual({ a: [1, 2] })
  })

  // 23. Unclosed object inside array
  it('patches and parses array with unclosed object', () => {
    expect(parseIncompleteJSONStream('[{"a":1')).toEqual([{ a: 1 }])
  })

  // 24. Mismatched open/close
  it('patches and parses mismatched open/close', () => {
    expect(parseIncompleteJSONStream('{"a": [1,2}')).toEqual({ a: [1, 2] })
  })

  // 25. Only a string
  it('patches and parses only a string', () => {
    expect(parseIncompleteJSONStream('"foo')).toBe('foo')
  })

  // 26. Only a number
  it('parses only a number', () => {
    expect(parseIncompleteJSONStream('123')).toBe(123)
  })

  // 27. Only a boolean/null
  it('returns null for incomplete boolean/null', () => {
    expect(parseIncompleteJSONStream('tru')).toBeNull()
    expect(parseIncompleteJSONStream('nul')).toBeNull()
  })
  it('parses only a boolean/null', () => {
    expect(parseIncompleteJSONStream('true')).toBe(true)
    expect(parseIncompleteJSONStream('false')).toBe(false)
    expect(parseIncompleteJSONStream('null')).toBe(null)
  })

  // 28. Malformed JSON that cannot be fixed
  it('returns null for irrecoverable malformed JSON', () => {
    expect(parseIncompleteJSONStream('{[}')).toBeNull()
    expect(parseIncompleteJSONStream('{"a":1,]')).toBeNull()
  })

  // 29. JSON with comments (should fail)
  it('returns null for JSON with comments', () => {
    expect(parseIncompleteJSONStream('{"a":1 // comment\n}')).toBeNull()
  })

  // 30. JSON with whitespace between tokens
  it('parses JSON with whitespace between tokens', () => {
    expect(parseIncompleteJSONStream(' { "a" : 1 , "b" : [ 2 , 3 ] } ')).toEqual({ a: 1, b: [2, 3] })
  })
})