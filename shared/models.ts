export type ID = number
export type ISODateString = string
export type LocalizedText = { [lang: string]: string }

export interface RoleRef {
  id: ID
  code: string
  label?: string
  colour?: string
}

export interface CategoryRef {
  id: ID
  code: string
  label?: string
  colour?: string
}

export interface StatusRef {
  id: ID
  code: string
  label?: string
  colour?: string
}

export interface UserRef {
  id: ID
  username: string
}

export interface NotificationTypeRef {
  code: string
  label?: string
}

export interface Role {
  id: ID
  code: string
  labels: LocalizedText
  colour?: string
}

export interface User {
  id: ID
  username: string
  email: string
  emailOptIn: boolean
  role: RoleRef
  isBanned: boolean
  createdAt: ISODateString
}

export type FieldKind =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multiselect"
  | "date"
  | "map"
  | "file"

// schema campi aggiuntivi per categoria
export interface BaseFormField {
  kind: FieldKind
  key: string // es. "budget"
  label: LocalizedText // etichetta multilingua
  required?: boolean
  helpText?: LocalizedText
}

export interface TextField extends BaseFormField {
  kind: "text"
  minLength?: number
  maxLength?: number
  pattern?: string // regex
}

export interface NumberField extends BaseFormField {
  kind: "number"
  min?: number
  max?: number
  step?: number
  unit?: string // es. "€"
}

export interface BooleanField extends BaseFormField {
  kind: "boolean"
}

export interface SelectField extends BaseFormField {
  kind: "select"
  options: Array<{ value: string; label: LocalizedText }>
}

export interface MultiSelectField extends BaseFormField {
  kind: "multiselect"
  options: Array<{ value: string; label: LocalizedText }>
}

export interface DateField extends BaseFormField {
  kind: "date"
  min?: ISODateString
  max?: ISODateString
}

export interface MapField extends BaseFormField {
  kind: "map"
  geoSchema?: unknown
}

export interface FileField extends BaseFormField {
  kind: "file"
  accept?: string[] // es. ["application/pdf","image/png"]
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
}

export type FormField =
  | TextField
  | NumberField
  | BooleanField
  | SelectField
  | MultiSelectField
  | DateField
  | MapField
  | FileField

export type CategoryFormSchema = FormField[]

export interface Category {
  id: ID
  code: string
  labels: LocalizedText
  description?: LocalizedText
  colour?: string
  formSchema: CategoryFormSchema
}

export interface Status {
  id: ID
  code: string
  labels: LocalizedText
  colour?: string
}

export interface Attachment {
  id: ID
  proposalId: ID
  fileUrl: string
  fileType?: string
  fileName?: string
  uploadedAt: ISODateString
  slotKey?: string
}

export interface Proposal {
  id: ID
  title: string
  description: string
  voteValue: number
  additionalData: Record<string, unknown>
  currentVersion: number
  category: CategoryRef
  status: StatusRef
  author: UserRef
  createdAt: ISODateString
  updatedAt?: ISODateString
  isFavourited?: boolean
  attachments?: Attachment[]
}

export interface ProposalHistoryEntry {
  id: ID
  proposalId: ID
  version: number
  title: string
  description: string
  additionalData?: Record<string, unknown>
  archivedAt: ISODateString
}

export interface ProposalVote {
  id: ID
  userId: ID
  proposalId: ID
  proposalVersion: number
  voteValue: -1 | 1
  createdAt: ISODateString
}

export interface Favourite {
  id: ID
  userId: ID
  proposalId?: ID
  pollId?: ID
  createdAt: ISODateString
}

export interface UserView {
  id: ID
  userId: ID
  proposalId: ID
  lastSeenAt: ISODateString
}

export interface Poll {
  id: ID
  title: string
  description?: string
  category?: CategoryRef
  createdBy: UserRef
  isActive: boolean
  expiresAt?: ISODateString
  createdAt: ISODateString
  questions?: PollQuestion[]
  isFavourited?: boolean
}

export interface PollQuestion {
  id: ID
  pollId: ID
  text: string
  orderIndex: number
}

export interface PollOption {
  id: ID
  questionId: ID
  text: string
  orderIndex: number
}

export interface PollAnswer {
  id: ID
  userId: ID
  questionId: ID
  selectedOptionId?: ID
  textResponse?: string
  createdAt: ISODateString
}

export type EntityType = "proposta" | "sondaggio" | "sanzione"
export type SanctionType = "ban" | "mute" | "warning"

export interface UserSanction {
  id: ID
  userId: ID
  moderatorId?: ID
  sanctionType: SanctionType
  reason: string
  expiresAt?: ISODateString
  createdAt: ISODateString
}

export interface AttachmentCreateInput {
  fileUrl: string
  fileType?: string
  fileName?: string
}

export interface ProposalInput {
  title?: string
  description?: string
  categoryId?: ID
  additionalData?: Record<string, unknown>
}

export interface PollCreateInput {
  title: string
  description?: string
  categoryId?: ID
  expiresAt?: ISODateString
  isActive?: boolean
  questions?: Array<{
    text: string
    orderIndex?: number
    options?: Array<{ text: string; orderIndex?: number }>
  }>
}

interface BaseSearchFilters {
  q?: string;              
  titlesOnly?: boolean;

  authorId?: number | string;       
  authorUsername?: string;
  categoryId?: number | string;     
  categoryCode?: string;

  favourites?: boolean; 

  dateFrom?: ISODateString;
  dateTo?: ISODateString;

  limit?: number;
  sortBy?: 'date' | 'votes' | 'title'; 
  sortOrder?: 'asc' | 'desc';
}

export interface ProposalFilters extends BaseSearchFilters {
  statusId?: number | string;
  statusCode?: string;
  
  minVotes?: number;
  maxVotes?: number;  
}

export interface PollFilters extends BaseSearchFilters {
  isActive?: boolean; 
}

export interface GlobalFilters extends BaseSearchFilters {
  type?: 'all' | 'proposta' | 'sondaggio';
  minVotes?: number;
  maxVotes?: number;
  statusId?: number | string;
  statusCode?: string;
  isActive?: boolean;
}

export interface ProposalSearchItem {
  type: "proposta"
  id: ID
  title: string
  description: string
  author?: string
  category?: string
  categoryColour?: string
  status?: string
  statusColour?: string
  voteValue?: number
  date?: string
  timestamp?: ISODateString
  isFavourited?: boolean
}

export interface PollSearchItem {
  type: "sondaggio"
  id: ID
  title: string
  description: string
  author?: string
  category?: string
  categoryColour?: string
  isActive?: boolean
  expiresAt?: string
  date?: string
  timestamp?: ISODateString
  isFavourited?: boolean
}

export interface NotificationType {
  id: ID
  code: string
  labels: LocalizedText
}

export interface Notification {
  id: ID
  userId: ID
  notificationType: NotificationTypeRef
  title: string
  message?: string
  isRead: boolean
  relatedObjectId?: ID
  relatedObjectType?: EntityType
  createdAt: ISODateString
}

export class ApiError extends Error {
  public readonly statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = this.constructor.name
    if (statusCode !== undefined) {
      this.statusCode = statusCode
    }

    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export type GlobalSearchItem = ProposalSearchItem | PollSearchItem
