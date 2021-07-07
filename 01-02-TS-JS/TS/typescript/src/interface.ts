export {}
interface Post {
  title: string
  content: string
  total: number
  status?: boolean // 可选
  readonly summary: string // 只读
}

const hello: Post = {
  title: 'TypeScript',
  content: 'hello',
  total: 100,
  status: true,
  summary: '好书'
}
