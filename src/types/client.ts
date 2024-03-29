import z from 'zod'

import type { Feature, Point } from 'geojson'

export const ValidationMap = {
  email: ['email'],
  min: ['min'],
}

export enum IDiffType {
  'SNAP' = 10,
  'NORMAL' = 20,
  'REMOVE' = 30,
}
export const IDiffTypeSchema = z.nativeEnum(IDiffType)

export enum IDiffFlag {
  'NEW' = 10,
  'REVIEW' = 20,
  'DONE' = 30,
  'APPROVED' = 40,
}
export const IDiffFlagSchema = z.nativeEnum(IDiffFlag)

export enum IDeltaType {
  'NEW' = 10,
  'CHANGE' = 20,
  'REMOVE' = 30,
}
export const IDeltaTypeSchema = z.nativeEnum(IDeltaType)

export enum IDataType {
  'STRING' = 10,
  'NUMBER' = 20,
  'BOOLEAN' = 30,
  'ENUM' = 40,
}
export const IDataTypeSchema = z.nativeEnum(IDataType)

export enum IUserRole {
  'ROOT' = 10,
  'ADMIN' = 20,
  'EDITOR' = 30,
  'OPERATOR' = 40,
  'VIEWER' = 50,
}
export const IUserRoleSchema = z.nativeEnum(IUserRole)

export enum IPointStatus {
  'PROCESSING' = 10,
  'DONE' = 20,
}
export const IPointStatusSchema = z.nativeEnum(IPointStatus)

export enum IDispositionStatus {
  'DEFAULT' = 10,
  'PROCESSING' = 20,
  'FAILED' = 30,
  'DONE' = 40,
}
export const IDispositionStatusSchema = z.nativeEnum(IDispositionStatus)

export enum IObjectResourceType {
  'SUPPLY' = 10,
  'PRODUCTION' = 20,
  'TRANSPORT' = 30,
  'HUMAN' = 40,
  'EQUIPMENT' = 50,
}
export const IObjectResourceTypeSchema = z.nativeEnum(IObjectResourceType)

export enum IMoveType {
  'FEDERAL' = 10,
  'REGIONAL' = 20,
  'MUNICIPAL' = 30,
  'DISTRICT' = 40,
}
export const IMoveTypeSchema = z.nativeEnum(IMoveType)

export const IMetaSchema = z.object({
  _id: z.string(),
  created: z.string(),
  edges: z.string().array().nullable(),
  etag: z.string(),
  level: z.number(),
  type: z.string(),
  updated: z.string(),
})
export type IMeta = z.infer<typeof IMetaSchema>

export enum IMetaScope {
  'DATA' = 'data',
  'DIFFS' = 'diffs',
  'DISPOSITIONS' = 'dispositions',
  'DOCUMENTS' = 'documents',
  'FOLDERS' = 'folders',
  'MOVES' = 'moves',
  'OBJECT_FIELDS' = 'object_fields',
  'OBJECT_LAYERS' = 'object_layers',
  'OBJECT_RESOURCES' = 'object_resources',
  'OBJECTS' = 'objects',
  'OBJECT_TYPES' = 'object_types',
  'POINTS' = 'points',
  'POSITIONS' = 'positions',
  'REGULATIONS' = 'regulations',
  'REPORTS' = 'reports',
  'SYNC_BACKUP' = 'sync_backup',
  'TASK_GROUPS' = 'task_groups',
  'TASKS' = 'tasks',
  'USERS' = 'users',
}
export const IMetaScopeSchema = z.nativeEnum(IMetaScope)

// export const IResponseErrorSchema = z.object({
//   code: z.number().optional(),
//   message: z.any().optional(),
// })
// export type IResponseError = z.infer<typeof IResponseErrorSchema>

// export const IResponseSchema = z.object({
//   error: IResponseErrorSchema.optional().nullable(),
//   data: z.any().optional().nullable(),
// })
// export type IResponse = z.infer<typeof IResponseSchema>

export const IUserInfoSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  notes: z.string().optional(),
  phone: z.string(),
})
export type IUserInfo = z.infer<typeof IUserInfoSchema>

export const IUserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  info: IUserInfoSchema,
  mandate: z.number().optional(),
  modules: z.string().array().optional().nullable(),
  role: IUserRoleSchema,
  scopes: IMetaScopeSchema.array().nullable(),
  meta: IMetaSchema.optional().nullable(),
})
export type IUser = z.infer<typeof IUserSchema>

export const IUserCreateInputSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  mandate: z.number().optional(),
  modules: z.string().array().nullable(),
  password: z.string().min(6).optional(),
  password_repeat: z.string().optional(),
  phone: z.string().optional(),
  role: IUserRoleSchema,
  scopes: IMetaScopeSchema.array().nullable(),
})
export type IUserCreateInput = z.infer<typeof IUserCreateInputSchema>

export const IUserUpdateInputSchema = z.object({
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  mandate: z.number().optional().nullable(),
  modules: z.string().array().optional().nullable(),
  notes: z.string().optional(),
  password: z.string().min(6).optional(),
  phone: z.string().optional(),
  role: IUserRoleSchema.optional().nullable(),
  scopes: IMetaScopeSchema.array().nullable(),
})
export type IUserUpdateInput = z.infer<typeof IUserUpdateInputSchema>

export const IUserLoginInputSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})
export type IUserLoginInput = z.infer<typeof IUserLoginInputSchema>

export const IUserTokensDataSchema = z.object({
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
})
export type IUserTokensData = z.infer<typeof IUserTokensDataSchema>

export const IObjectInfoSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  notes: z.string().optional(),
})
export type IObjectInfo = z.infer<typeof IObjectInfoSchema>

export const IObjectSchema = z.object({
  _id: z.string(),
  feature: z.unknown().nullable(),
  fields: z.record(z.any()),
  info: IObjectInfoSchema,
  level: z.number(),
  demands: z.record(z.number()),
  parent: z.string().nullable(),
  resources: z.record(z.number()),
  type: z.string(),
  meta: IMetaSchema.optional().nullable(),
})
export type IObject = z.infer<typeof IObjectSchema> & { feature: TFeature }

export const IObjectCreateInputSchema = z.object({
  code: z.string().optional(),
  feature: z.any().optional().nullable(),
  fields: z.record(z.any()).optional(),
  name: z.string(),
  notes: z.string().optional(),
  parent: z.string().nullable(),
  resources: z.record(z.any()).optional(),
  demands: z.record(z.any()).optional(),
  type: z.string(),
})
export type IObjectCreateInput = z.infer<typeof IObjectCreateInputSchema>

export const IObjectUpdateInputSchema = z.object({
  code: z.string().optional(),
  feature: z.any().optional().nullable(),
  fields: z.record(z.any()).optional().nullable(),
  name: z.string().optional(),
  notes: z.string().optional(),
  parent: z.string().nullable(),
  resources: z.record(z.any()).optional().nullable(),
  demands: z.record(z.any()).optional().nullable(),
})
export type IObjectUpdateInput = z.infer<typeof IObjectUpdateInputSchema>

export const IObjectTypeInfoSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  notes: z.string().optional(),
})
export type IObjectTypeInfo = z.infer<typeof IObjectTypeInfoSchema>

export const IObjectTypeSchema = z.object({
  _id: z.string(),
  fields: z.string().array().nullable(),
  icon: z.string().optional(),
  info: IObjectTypeInfoSchema,
  order: z.number(),
  meta: IMetaSchema.optional().nullable(),
})
export type IObjectType = z.infer<typeof IObjectTypeSchema>

export const IObjectTypeCreateInputSchema = z.object({
  code: z.string().optional(),
  fields: z.string().array().nullable(),
  icon: z.string().optional(),
  name: z.string(),
  notes: z.string().optional(),
  order: z.number(),
})
export type IObjectTypeCreateInput = z.infer<typeof IObjectTypeCreateInputSchema>

export const IObjectTypeUpdateInputSchema = z.object({
  code: z.string().optional(),
  fields: z.string().array().nullable(),
  icon: z.string().optional(),
  name: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().optional().nullable(),
})
export type IObjectTypeUpdateInput = z.infer<typeof IObjectTypeUpdateInputSchema>

export const IObjectFieldInfoSchema = z.object({
  name: z.string(),
  notes: z.string().optional(),
  group_name: z.string().optional(),
})
export type IObjectFieldInfo = z.infer<typeof IObjectFieldInfoSchema>

export const IObjectFieldSchema = z.object({
  _id: z.string(),
  group: z.string(),
  info: IObjectFieldInfoSchema,
  public: z.boolean(),
  mandate: z.number(),
  type: IDataTypeSchema,
  validation: z.string(),
  values: z.record(z.string()).optional(),
})
export type IObjectField = z.infer<typeof IObjectFieldSchema>

export const IMoveInfoSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  notes: z.string().optional(),
})
export type IMoveInfo = z.infer<typeof IMoveInfoSchema>

export const IMoveSchema = z.object({
  _id: z.string(),
  document: z.string(),
  feature: z.unknown().nullable(),
  group: z.string(),
  info: IMoveInfoSchema,
  public: z.boolean(),
  receiver: z.string(),
  resource: z.string(),
  sender: z.string(),
  type: IMoveTypeSchema,
  value: z.number(),
  meta: IMetaSchema.optional().nullable(),
})

export type TFeature = Feature<Point, {
  id: string
  label: string
  icon: string
}> & { state: Record<string, string | boolean | number> }

export type IMove = z.infer<typeof IMoveSchema> & {
  feature: {
    sender: TFeature
    receiver: TFeature
  }
}

export const IMoveCreateInputSchema = z.object({
  code: z.string().optional(),
  document: z.string().optional().nullable(),
  feature: z.any().nullable(),
  group: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  receiver: z.string(),
  resource: z.string(),
  sender: z.string(),
  type: IMoveTypeSchema,
  value: z.number(),
})
export type IMoveCreateInput = z.infer<typeof IMoveCreateInputSchema>

export const IMoveUpdateInputSchema = z.object({
  code: z.string().optional(),
  document: z.string().optional().nullable(),
  feature: z.any().nullable(),
  group: z.string(),
  name: z.string().optional(),
  notes: z.string().optional(),
  receiver: z.string().optional(),
  resource: z.string().optional(),
  sender: z.string().optional(),
  type: IMoveTypeSchema,
  value: z.number().optional(),
})
export type IMoveUpdateInput = z.infer<typeof IMoveUpdateInputSchema>

export const IDeltaSchema = z.object({
  pt: z.string().array().nullable(),
  tp: IDeltaTypeSchema,
  pv: z.any(),
  nt: z.any(),
})
export type IDelta = z.infer<typeof IDeltaSchema>

export const IDiffSchema = z.object({
  _id: z.string(),
  dt: IDeltaSchema.array().nullable(),
  mt: IDeltaSchema.array().nullable(),
  fg: IDiffFlagSchema,
  pv: z.string(),
  ti: z.string(),
  tt: IMetaScopeSchema,
  tp: IDiffTypeSchema,
  ts: z.number(),
  un: z.number(),
  ui: z.string(),
})
export type IDiff = z.infer<typeof IDiffSchema>

export const IChangeSchema = z.object({
  un: z.number(),
  diffs: IDiffSchema.array().nullable(),
})
export type IChange = z.infer<typeof IChangeSchema>

export interface IPointMap {
  type: string
  geometry: {
    type: string
    coordinates: number[]
  }
  // properties: {}
}
export interface IObjectMap {
  _id: string
  name: string
  map: IPointMap
}

export interface ISelection {
  filters_by_districts: string[]
  filters_by_types: string[]
  filters_by_fields: ISelectionCondition[][]
  filters_by_resources: ISelectionCondition[][]
  result_fields: string[]
  name_selections: string[]
  result_resources: string[]
  objects: string[]
  name: string
  notes: string
}
export interface ISelectionCondition {
  field_id: string | undefined
  operation:
  | 'less-than'
  | 'less-than-equal'
  | 'equal'
  | 'greater-than-equal'
  | 'greater-than'
  | 'yes'
  | 'no'
  field_value: number
}
