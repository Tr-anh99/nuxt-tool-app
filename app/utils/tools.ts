export interface ToolDefinition {
  id: string
  label: string
  description: string
  icon: string
  to: string
  group: string
}

export const tools: ToolDefinition[] = [
  {
    id: 'jwt-decode',
    label: 'JWT Decode',
    description: 'Giải mã header và payload của một JSON Web Token.',
    icon: 'i-lucide-key-round',
    to: '/jwt-decode',
    group: 'Giải mã & Format'
  },
  {
    id: 'json-format',
    label: 'JSON Format',
    description: 'Format lại chuỗi JSON cho dễ đọc và kiểm tra cú pháp.',
    icon: 'i-lucide-braces',
    to: '/json-format',
    group: 'Giải mã & Format'
  },
  {
    id: 'query-to-json',
    label: 'Query String → JSON',
    description: 'Chuyển query string (key=value&key2=value2) sang đối tượng JSON.',
    icon: 'i-lucide-link-2',
    to: '/query-to-json',
    group: 'Chuyển đổi'
  },
  {
    id: 'json-to-query',
    label: 'JSON → Query String',
    description: 'Chuyển đối tượng JSON sang query string (key=value&key2=value2).',
    icon: 'i-lucide-link-2',
    to: '/json-to-query',
    group: 'Chuyển đổi'
  },
  {
    id: 'env-to-json',
    label: 'Env → JSON',
    description: 'Chuyển nội dung file .env sang đối tượng JSON.',
    icon: 'i-lucide-file-json-2',
    to: '/env-to-json',
    group: 'Chuyển đổi'
  },
  {
    id: 'json-to-env',
    label: 'JSON → Env',
    description: 'Chuyển đối tượng JSON sang các dòng biến môi trường.',
    icon: 'i-lucide-file-cog',
    to: '/json-to-env',
    group: 'Chuyển đổi'
  },
  {
    id: 'json-to-array',
    label: 'JSON → Array',
    description: 'Trích giá trị của một hoặc nhiều attribute từ mảng object JSON thành mảng mới.',
    icon: 'i-lucide-list',
    to: '/json-to-array',
    group: 'Chuyển đổi'
  },
  {
    id: 'csv-to-json',
    label: 'CSV → JSON',
    description: 'Chuyển file CSV sang mảng JSON, tự động ép kiểu number khi có thể.',
    icon: 'i-lucide-file-spreadsheet',
    to: '/csv-to-json',
    group: 'Chuyển đổi'
  },
  {
    id: 'unicode-unescape',
    label: 'Unicode → Tiếng Việt',
    description: 'Chuyển chuỗi escape Unicode (d\u1ea1ng backslash + uXXXX) sang văn bản tiếng Việt.',
    icon: 'i-lucide-languages',
    to: '/unicode-unescape',
    group: 'Chuyển đổi'
  },
  {
    id: 'json-to-mongo-insert',
    label: 'JSON → Mongo insertMany',
    description: 'Sinh câu lệnh db.collection.insertMany() từ mảng JSON, tuỳ chỉnh field bằng attribute hoặc template chuỗi.',
    icon: 'i-lucide-database',
    to: '/json-to-mongo-insert',
    group: 'Database'
  },
  {
    id: 'json-to-sql-insert',
    label: 'JSON → SQL Insert',
    description: 'Sinh câu lệnh INSERT INTO nhiều dòng từ mảng JSON, tuỳ chỉnh field bằng attribute hoặc template chuỗi.',
    icon: 'i-lucide-table-2',
    to: '/json-to-sql-insert',
    group: 'Database'
  },
  {
    id: 'sql-partition',
    label: 'Tạo Partition',
    description: 'Sinh câu lệnh PARTITION BY RANGE theo khoảng thời gian và chu kỳ.',
    icon: 'i-lucide-table-properties',
    to: '/sql-partition',
    group: 'Database'
  },
  {
    id: 'sql-partition-reorganize',
    label: 'Reorganize Partition',
    description: 'Phân tích DDL hiện có để sinh câu lệnh drop và thêm partition mới.',
    icon: 'i-lucide-database-zap',
    to: '/sql-partition-reorganize',
    group: 'Database'
  },
  {
    id: 'ghtk-order-code',
    label: 'GHTK: Tách mã đơn hàng',
    description: 'Tách danh sách mã vận đơn Giao Hàng Tiết Kiệm thành mã đơn hàng (chuỗi số sau dấu chấm cuối cùng).',
    icon: 'i-lucide-truck',
    to: '/ghtk-order-code',
    group: 'GHTK'
  }
]

export const toolGroups = ['Giải mã & Format', 'Chuyển đổi', 'Database', 'GHTK']
