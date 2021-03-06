import * as t from 'io-ts'
import { Option, None, Some, fromNullable } from 'fp-ts/lib/Option'

export type JSONOption<A> = {
  type: 'Option'
  value: A | null | undefined
}

export function createOptionFromJSON<A>(type: t.Type<any, A>): t.Type<any, Option<A>> {
  const JSONOption = t.interface({
    type: t.literal('Option'),
    value: t.union([type, t.null, t.undefined])
  })
  return new t.Type(
    `Option<${type.name}>`,
    (v): v is Option<A> => v instanceof Some || v instanceof None,
    (s, c) => JSONOption.validate(s, c).chain(o => t.success(fromNullable(o.value))),
    a => ({ type: 'Option', value: a.toNullable() })
  )
}
