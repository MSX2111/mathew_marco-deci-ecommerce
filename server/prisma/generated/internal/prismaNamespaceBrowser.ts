






import * as runtime from "@prisma/client/runtime/index-browser"

export type * from '../models.ts'
export type * from './prismaNamespace.ts'

export const Decimal = runtime.Decimal


export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}

export const DbNull = runtime.DbNull


export const JsonNull = runtime.JsonNull


export const AnyNull = runtime.AnyNull


export const ModelName = {
  User: 'User',
  Products: 'Products',
  Cart: 'Cart',
  CartItem: 'CartItem'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]



export const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
} as const)

export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


export const UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  isAdmin: 'isAdmin'
} as const

export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


export const ProductsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  imageURL: 'imageURL',
  category: 'category'
} as const

export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum]


export const CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId'
} as const

export type CartScalarFieldEnum = (typeof CartScalarFieldEnum)[keyof typeof CartScalarFieldEnum]


export const CartItemScalarFieldEnum = {
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity'
} as const

export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum]


export const SortOrder = {
  asc: 'asc',
  desc: 'desc'
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


export const QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
} as const

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

