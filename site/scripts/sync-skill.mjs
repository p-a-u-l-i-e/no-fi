// Copies ../no-fi into public/no-fi so every skill file is served as a raw,
// readable URL, and packs it as public/no-fi.zip for claude.ai, which takes a
// ZIP with the skill folder at its root. Runs before dev and build.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { skillFiles, SKILL_DIR } from "../app/lib/skill.js";

const publicDir = path.join(process.cwd(), "public");
const dest = path.join(publicDir, "no-fi");
fs.rmSync(dest, { recursive: true, force: true });
for (const file of skillFiles()) {
  const target = path.join(dest, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(SKILL_DIR, file), target);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// A minimal ZIP writer: deflated files, no directories, a fixed 1980 date so
// the same skill always packs to the same bytes.
function zip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const packed = zlib.deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4); // version needed
    header.writeUInt16LE(0x0800, 6); // UTF-8 names
    header.writeUInt16LE(8, 8); // deflate
    header.writeUInt16LE(0, 10); // time
    header.writeUInt16LE(0x21, 12); // date: 1980-01-01
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(packed.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(nameBytes.length, 26);
    header.writeUInt16LE(0, 28);
    local.push(header, nameBytes, packed);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4); // version made by
    header.copy(entry, 6, 4, 30); // shared fields
    entry.writeUInt16LE(0, 32); // comment length
    entry.writeUInt16LE(0, 34); // disk
    entry.writeUInt16LE(0, 36); // internal attributes
    entry.writeUInt32LE(0, 38); // external attributes
    entry.writeUInt32LE(offset, 42);
    central.push(entry, nameBytes);
    offset += header.length + nameBytes.length + packed.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

const entries = skillFiles().map((file) => ({
  name: `no-fi/${file}`,
  data: fs.readFileSync(path.join(SKILL_DIR, file)),
}));
fs.writeFileSync(path.join(publicDir, "no-fi.zip"), zip(entries));
