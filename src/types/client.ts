import z from 'zod'

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
  feature: z.any().nullable(),
  fields: z.record(z.any()),
  info: IObjectInfoSchema,
  level: z.number(),
  demands: z.record(z.number()),
  parent: z.string().nullable(),
  resources: z.record(z.number()),
  type: z.string(),
  meta: IMetaSchema.optional().nullable(),
})
export type IObject = z.infer<typeof IObjectSchema>

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
