import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { formatKhmerDateText, formatKhmerTimeText, formatKhmerDateStandard } from "./khmerUtils";

interface Attendee {
  id: number;
  name: string;
  gender: string;
  role: string;
  phone: string;
  note: string;
}

interface ExportData {
  ministry: string;
  office: string;
  school: string;
  topic: string;
  lunarDate: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  chair: string;
  secretary: string;
  agenda: string;
  content: string;
  decision: string;
  attendees: Attendee[];
}

export const exportToWord = async (data: ExportData) => {
  const formattedDate = data.date ? new Date(data.date).toLocaleDateString('km-KH') : "..............ខែ...........ឆ្នាំ........";

  const createCell = (text: string, bold: boolean = false) => {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold, font: "Khmer OS System", size: 22 })], alignment: AlignmentType.CENTER })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
  };

  const validAttendees = data.attendees.filter(a => a.name.trim() !== "");

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: "\nជាតិ សាសនា ព្រះមហាក្សត្រ", bold: true, size: 26, break: 1, font: "Khmer OS Muol Light" }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: data.ministry || "", bold: true, font: "Khmer OS Muol Light" }),
              new TextRun({ text: data.office ? `\n${data.office}` : "", bold: true, break: 1, font: "Khmer OS Muol Light" }),
              new TextRun({ text: data.school ? `\n${data.school}` : "", bold: true, break: 1, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "កំណត់ហេតុប្រជុំ", bold: true, size: 26, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "ស្ដីពី", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: `\n${data.topic || "...................................................."}`, break: 1, size: 26, bold: true, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun({ text: `             ${data.date ? formatKhmerDateText(data.date) : "ឆ្នាំ........... ខែ........... ថ្ងៃទី........... "} វេលាម៉ោង ${data.startTime ? formatKhmerTimeText(data.startTime) : "........... "} ${data.location || "..................."} បានរៀបចំកិច្ចប្រជុំស្ដីពី ${data.topic || "...................................................."}។ កិច្ចប្រជុំនេះស្ថិតក្រោមអធិបតីភាព${data.chair || "..................."} ជានាយក${data.school || "..................."}។`, size: 22, font: "Khmer OS System" }),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "I. សមាសភាពអ្នកចូលរួម (ដូចមានបញ្ជីវត្តមានភ្ជាប់មកជាមួយ)", bold: true, size: 22, font: "Khmer OS System" }),
            ],
            spacing: { after: 200 }
          }),

          ...(validAttendees.length > 0 ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    createCell("ល.រ", true),
                    createCell("ឈ្មោះ - នាមត្រកូល", true),
                    createCell("ភេទ", true),
                    createCell("តួនាទី", true),
                    createCell("លេខទូរស័ព្ទ", true),
                    createCell("ផ្សេងៗ", true),
                  ],
                }),
                ...validAttendees.map((a, i) => new TableRow({
                  children: [
                    createCell(`${i + 1}`, false),
                    createCell(a.name, false),
                    createCell(a.gender, false),
                    createCell(a.role, false),
                    createCell(a.phone, false),
                    createCell(a.note, false),
                  ]
                }))
              ],
            }),
            new Paragraph({ text: "", spacing: { after: 300 } })
          ] : [
            new Paragraph({
              children: [new TextRun({ text: "    មិនមានអ្នកចូលរួម", font: "Khmer OS System", size: 22 })],
              spacing: { after: 400 }
            })
          ]),

          new Paragraph({
            children: [
              new TextRun({ text: "II. របៀបវារៈ", bold: true, size: 22, font: "Khmer OS System" }),
            ],
            spacing: { after: 200 }
          }),
          ...(data.agenda.split("\n").map(line => new Paragraph({
            children: [new TextRun({ text: line, size: 22, font: "Khmer OS System" })],
            indent: { left: 720 }
          }))),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            children: [
              new TextRun({ text: "III. ដំណើរការនៃកិច្ចប្រជុំ និងខ្លឹមសារ", bold: true, size: 22, font: "Khmer OS System" }),
            ],
            spacing: { after: 200 }
          }),
          ...(data.content ? data.content.split("\n").map(line => new Paragraph({
            children: [new TextRun({ text: line, size: 22, font: "Khmer OS System" })],
            indent: { left: 720 },
            alignment: AlignmentType.JUSTIFIED
          })) : [new Paragraph({ children: [new TextRun({ text: "     (ខ្លឹមសារកិច្ចប្រជុំនឹងបង្ហាញនៅទីនេះ...)", font: "Khmer OS System", size: 22 })] })]),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          ...(data.decision ? [
            new Paragraph({
              children: [
                new TextRun({ text: "IV. សេចក្ដីសម្រេច", bold: true, size: 22, font: "Khmer OS System" }),
              ],
              spacing: { after: 200 }
            }),
             ...data.decision.split("\n").map(line => new Paragraph({
               children: [new TextRun({ text: line, size: 22, font: "Khmer OS System" })],
               indent: { left: 720 },
               alignment: AlignmentType.JUSTIFIED
             })),
            new Paragraph({ text: "", spacing: { after: 400 } })
          ] : []),

          new Paragraph({
            children: [
              new TextRun({ text: `             កិច្ចប្រជុំបានបញ្ចប់នៅវេលាម៉ោង ${data.endTime ? formatKhmerTimeText(data.endTime) : "........... "} នាថ្ងៃខែឆ្នាំដដែល ក្នុងបរិយាកាសរីករាយ និងស្និទ្ធស្នាល។`, size: 22, font: "Khmer OS System" })
            ],
            spacing: { after: 400 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: "បានឃើញ និងឯកភាព", bold: true, size: 22, font: "Khmer OS System" })], alignment: AlignmentType.CENTER }),
                      new Paragraph({ children: [new TextRun({ text: "នាយកសាលា", size: 22, font: "Khmer OS System" })], alignment: AlignmentType.CENTER }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [new TextRun({ text: data.lunarDate || "ថ្ងៃ.................... ខែ........... ឆ្នាំ........... ព.ស. ២៥...", size: 22, font: "Khmer OS System" })], alignment: AlignmentType.CENTER }),
                      new Paragraph({ children: [new TextRun({ text: `${data.location || "អូរតាប្រុក"}, ${formatKhmerDateStandard(data.date || "")}`, size: 22, font: "Khmer OS System" })], alignment: AlignmentType.CENTER }),
                      new Paragraph({ children: [new TextRun({ text: "អ្នកធ្វើកំណត់ហេតុ", size: 22, font: "Khmer OS System", color: "1e40af" })], alignment: AlignmentType.CENTER, spacing: { before: 120 } }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Meeting_Minutes.docx");
};

export const exportBlankAttendanceToWord = async (data: ExportData) => {
  const createCell = (text: string, bold: boolean = false) => {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold, font: "Khmer OS System", size: 22 })], alignment: AlignmentType.CENTER })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: "\nជាតិ សាសនា ព្រះមហាក្សត្រ", bold: true, size: 26, break: 1, font: "Khmer OS Muol Light" }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: data.ministry || "", bold: true, font: "Khmer OS Muol Light" }),
              new TextRun({ text: data.office ? `\n${data.office}` : "", bold: true, break: 1, font: "Khmer OS Muol Light" }),
              new TextRun({ text: data.school ? `\n${data.school}` : "", bold: true, break: 1, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "សម្រង់វត្តមានប្រជុំ", bold: true, size: 26, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "ស្ដីពី: ", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: `${data.topic || "......................................................."}`, size: 26, bold: true, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 400 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell("ល.រ", true),
                  createCell("ឈ្មោះ - នាមត្រកូល", true),
                  createCell("ភេទ", true),
                  createCell("តួនាទី", true),
                  createCell("លេខទូរស័ព្ទ", true),
                  createCell("ហត្ថលេខា", true),
                  createCell("ផ្សេងៗ", true),
                ],
              }),
              ...Array.from({ length: 20 }).map((_, i) => new TableRow({
                children: [
                  createCell(`${i + 1}`, false),
                  createCell("", false),
                  createCell("", false),
                  createCell("", false),
                  createCell("", false),
                  createCell("", false),
                  createCell("", false),
                ],
                height: { value: 600, rule: "atLeast" }
              }))
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Blank_Attendance.docx");
};

export const exportFilledAttendanceToWord = async (data: ExportData) => {
  const createCell = (text: string, bold: boolean = false) => {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold, font: "Khmer OS System", size: 22 })], alignment: AlignmentType.CENTER })],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
      margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "ព្រះរាជាណាចក្រកម្ពុជា", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: "\nជាតិ សាសនា ព្រះមហាក្សត្រ", bold: true, size: 26, break: 1, font: "Khmer OS Muol Light" }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              ...(data.ministry ? [new TextRun({ text: data.ministry, bold: true, font: "Khmer OS Muol Light" })] : []),
              ...(data.office ? [new TextRun({ text: `\n${data.office}`, bold: true, break: 1, font: "Khmer OS Muol Light" })] : []),
              ...(data.school ? [new TextRun({ text: `\n${data.school}`, bold: true, break: 1, font: "Khmer OS Muol Light" })] : []),
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "សម្រង់វត្តមានប្រជុំ", bold: true, size: 26, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "ស្ដីពី: ", bold: true, size: 26, font: "Khmer OS Muol Light" }),
              new TextRun({ text: `${data.topic || "......................................................."}`, size: 26, bold: true, font: "Khmer OS Muol Light" }),
            ],
            spacing: { after: 400 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell("ល.រ", true),
                  createCell("ឈ្មោះ - នាមត្រកូល", true),
                  createCell("ភេទ", true),
                  createCell("តួនាទី", true),
                  createCell("លេខទូរស័ព្ទ", true),
                  createCell("ហត្ថលេខា", true),
                  createCell("ផ្សេងៗ", true),
                ],
              }),
              ...(data.attendees && data.attendees.length > 0
                ? data.attendees.map((a, i) => new TableRow({
                    children: [
                      createCell(`${i + 1}`, false),
                      createCell(a.name || "", false),
                      createCell(a.gender || "", false),
                      createCell(a.role || "", false),
                      createCell(a.phone || "", false),
                      createCell("", false),
                      createCell(a.note || "", false),
                    ],
                    height: { value: 600, rule: "atLeast" }
                  }))
                : Array.from({ length: 5 }).map((_, i) => new TableRow({
                    children: [
                      createCell(`${i + 1}`, false),
                      createCell("", false),
                      createCell("", false),
                      createCell("", false),
                      createCell("", false),
                      createCell("", false),
                      createCell("", false),
                    ],
                    height: { value: 600, rule: "atLeast" }
                  })))
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Filled_Attendance.docx");
};
