export const KHMER_NUMBERS = ["សូន្យ", "មួយ", "ពីរ", "បី", "បួន", "ប្រាំ", "ប្រាំមួយ", "ប្រាំពីរ", "ប្រាំបី", "ប្រាំបួន"];
export const KHMER_TENS = ["", "ដប់", "ម្ភៃ", "សាមសិប", "សែសិប", "ហាសិប", "ហុកសិប", "ចិតសិប", "ប៉ែតសិប", "កៅសិប"];
export const KHMER_MONTHS = ["", "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];

export function numberToKhmerText(num: number): string {
  if (num < 10) return KHMER_NUMBERS[num];
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    if (ones === 0) return KHMER_TENS[tens];
    if (tens === 1) return `ដប់${KHMER_NUMBERS[ones]}`;
    return `${KHMER_TENS[tens]}${KHMER_NUMBERS[ones]}`;
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rest = num % 100;
    if (rest === 0) return `${KHMER_NUMBERS[hundreds]}រយ`;
    return `${KHMER_NUMBERS[hundreds]}រយ${numberToKhmerText(rest)}`;
  }
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const rest = num % 1000;
    if (rest === 0) return `${KHMER_NUMBERS[thousands]}ពាន់`;
    return `${KHMER_NUMBERS[thousands]}ពាន់${numberToKhmerText(rest)}`;
  }
  return num.toString();
}

export function formatKhmerDateStandard(dateStr: string): string {
  if (!dateStr) return "........... ខែ........... ឆ្នាំ...........";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return "........... ខែ........... ឆ្នាំ...........";

  const splitByDigit = (numStr: string) => {
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return numStr.split('').map(d => khmerDigits[parseInt(d, 10)]).join('');
  };

  const year = splitByDigit(parts[0]);
  const month = parseInt(parts[1], 10);
  const dayStr = splitByDigit(parts[2]);

  return `ថ្ងៃទី${dayStr} ខែ${KHMER_MONTHS[month]} ឆ្នាំ${year}`;
}

export function formatKhmerDateText(dateStr: string): string {
  if (!dateStr) return "...........";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return "...........";

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  return `ឆ្នាំ${numberToKhmerText(year)} ខែ${KHMER_MONTHS[month]} ថ្ងៃទី${numberToKhmerText(day)}`;
}

export function formatKhmerTimeText(timeStr: string): string {
  if (!timeStr) return "...........";
  const parts = timeStr.split(':');
  if (parts.length < 2) return "...........";

  const hour = parseInt(parts[0], 10);
  const min = parseInt(parts[1], 10);

  let period = "ព្រឹក";
  if (hour >= 12 && hour < 18) period = "រសៀល";
  if (hour >= 18 || hour === 0) period = "យប់";

  const hText = numberToKhmerText(hour);
  const mText = min === 0 ? "គត់" : ` នឹង${numberToKhmerText(min)}នាទី`;

  return `${hText}${mText}${period}`;
}
