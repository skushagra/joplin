import { ModelType } from "../../BaseModel";

export interface BaseItemEntity {
  id?: string;
  encryption_applied?: number;

  // Means the item (note or resource) is published
  is_shared?: number;

  // Means the item (note, folder or resource) is shared, as part of a shared
  // notebook
  share_id?: string;
  type_?: ModelType;
  updated_time?: number;
  created_time?: number;
}

export enum FolderIconType {
  Emoji = 1,
  DataUrl = 2,
  FontAwesome = 3,
}

export interface FolderIcon {
  type: FolderIconType;
	emoji: string;
	name: string;
  dataUrl: string;
}

export const defaultFolderIcon = () => {
  const icon:FolderIcon = {
    type: FolderIconType.Emoji,
    emoji: '',
    name: '',
    dataUrl: '',
  };
  return icon;
}

export interface NoteUserDataValue {
  v: any; // value
  t: Number; // timestamp
  d?: Number; // deleted - 0 or 1 (default = 0)
}

export type NoteUserData = Record<string, Record<string, NoteUserDataValue>>;























// AUTO-GENERATED BY packages/tools/generate-database-types.js

/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface AlarmEntity {
  'id'?: number | null;
  'note_id'?: string;
  'trigger_time'?: number;
  'type_'?: number;
}
export interface DeletedItemEntity {
  'deleted_time'?: number;
  'id'?: number | null;
  'item_id'?: string;
  'item_type'?: number;
  'sync_target'?: number;
  'type_'?: number;
}
export interface FolderEntity {
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_cipher_text'?: string;
  'icon'?: string;
  'id'?: string | null;
  'is_shared'?: number;
  'master_key_id'?: string;
  'parent_id'?: string;
  'share_id'?: string;
  'title'?: string;
  'updated_time'?: number;
  'user_created_time'?: number;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface ItemChangeEntity {
  'before_change_item'?: string;
  'created_time'?: number;
  'id'?: number | null;
  'item_id'?: string;
  'item_type'?: number;
  'source'?: number;
  'type'?: number;
  'type_'?: number;
}
export interface KeyValueEntity {
  'id'?: number | null;
  'key'?: string;
  'type'?: number;
  'updated_time'?: number;
  'value'?: string;
  'type_'?: number;
}
export interface MigrationEntity {
  'created_time'?: number;
  'id'?: number | null;
  'number'?: number;
  'updated_time'?: number;
  'type_'?: number;
}
export interface NoteResourceEntity {
  'id'?: number | null;
  'is_associated'?: number;
  'last_seen_time'?: number;
  'note_id'?: string;
  'resource_id'?: string;
  'type_'?: number;
}
export interface NoteTagEntity {
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_cipher_text'?: string;
  'id'?: string | null;
  'is_shared'?: number;
  'note_id'?: string;
  'tag_id'?: string;
  'updated_time'?: number;
  'user_created_time'?: number;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface NoteEntity {
  'altitude'?: number;
  'application_data'?: string;
  'author'?: string;
  'body'?: string;
  'conflict_original_id'?: string;
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_cipher_text'?: string;
  'id'?: string | null;
  'is_conflict'?: number;
  'is_shared'?: number;
  'is_todo'?: number;
  'latitude'?: number;
  'longitude'?: number;
  'markup_language'?: number;
  'master_key_id'?: string;
  'order'?: number;
  'parent_id'?: string;
  'share_id'?: string;
  'source'?: string;
  'source_application'?: string;
  'source_url'?: string;
  'title'?: string;
  'todo_completed'?: number;
  'todo_due'?: number;
  'updated_time'?: number;
  'user_created_time'?: number;
  'user_data'?: string;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface NotesNormalizedEntity {
  'altitude'?: number;
  'body'?: string;
  'id'?: string;
  'is_todo'?: number;
  'latitude'?: number;
  'longitude'?: number;
  'parent_id'?: string;
  'source_url'?: string;
  'title'?: string;
  'todo_completed'?: number;
  'todo_due'?: number;
  'user_created_time'?: number;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface ResourceLocalStateEntity {
  'fetch_error'?: string;
  'fetch_status'?: number;
  'id'?: number | null;
  'resource_id'?: string;
  'type_'?: number;
}
export interface ResourceEntity {
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_blob_encrypted'?: number;
  'encryption_cipher_text'?: string;
  'file_extension'?: string;
  'filename'?: string;
  'id'?: string | null;
  'is_shared'?: number;
  'master_key_id'?: string;
  'mime'?: string;
  'share_id'?: string;
  'size'?: number;
  'title'?: string;
  'updated_time'?: number;
  'user_created_time'?: number;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface ResourcesToDownloadEntity {
  'created_time'?: number;
  'id'?: number | null;
  'resource_id'?: string;
  'updated_time'?: number;
  'type_'?: number;
}
export interface RevisionEntity {
  'body_diff'?: string;
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_cipher_text'?: string;
  'id'?: string | null;
  'item_id'?: string;
  'item_type'?: number;
  'item_updated_time'?: number;
  'metadata_diff'?: string;
  'parent_id'?: string;
  'title_diff'?: string;
  'updated_time'?: number;
  'type_'?: number;
}
export interface SettingEntity {
  'key'?: string | null;
  'value'?: string | null;
  'type_'?: number;
}
export interface SyncItemEntity {
  'force_sync'?: number;
  'id'?: number | null;
  'item_id'?: string;
  'item_location'?: number;
  'item_type'?: number;
  'sync_disabled'?: number;
  'sync_disabled_reason'?: string;
  'sync_target'?: number;
  'sync_time'?: number;
  'type_'?: number;
}
export interface TableFieldEntity {
  'field_default'?: string | null;
  'field_name'?: string;
  'field_type'?: number;
  'id'?: number | null;
  'table_name'?: string;
  'type_'?: number;
}
export interface TagEntity {
  'created_time'?: number;
  'encryption_applied'?: number;
  'encryption_cipher_text'?: string;
  'id'?: string | null;
  'is_shared'?: number;
  'parent_id'?: string;
  'title'?: string;
  'updated_time'?: number;
  'user_created_time'?: number;
  'user_updated_time'?: number;
  'type_'?: number;
}
export interface TagsWithNoteCountEntity {
  'created_time'?: number | null;
  'id'?: string | null;
  'note_count'?: any | null;
  'title'?: string | null;
  'todo_completed_count'?: any | null;
  'updated_time'?: number | null;
  'type_'?: number;
}
export interface VersionEntity {
  'table_fields_version'?: number;
  'version'?: number;
  'type_'?: number;
}
