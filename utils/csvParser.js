/**
 * CSV Parser Utility
 * Parses CSV file content into array of objects
 */

const parseCSV = (content, columnMapping = {}) => {
  const lines = content.split('\n').filter((line) => line.trim());

  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const record = {};

    headers.forEach((header, index) => {
      const mappedKey = columnMapping[header] || header;
      record[mappedKey] = values[index] || '';
    });

    records.push(record);
  }

  return records;
};

module.exports = { parseCSV };
