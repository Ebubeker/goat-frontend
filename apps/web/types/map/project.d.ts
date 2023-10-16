import type { SourceProps, LayerProps } from "@/types/map/layers";

export interface GroupSharedWith {
  group_id: number;
  group_name: string;
  image_url: string;
}

export interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  min_zoom: number;
  max_zoom: number;
  bearing: number;
  pitch: number;
}
export interface Report {
  id: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  layers: (SourceProps & LayerProps)[];
  tags: string[];
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  shared_with: GroupSharedWith[];
  initial_view_state: MapViewState;
  reports: Report[];
}

export interface Layer {
  active?: boolean;
  created_at: string;
  data_source: string;
  extent: string;
  feature_layer_type: string;
  folder_id: string;
  id: string;
  name: string;
  size: number;
  style?: Record<string, unknown>; // Empty object for now, but you can define a more specific type if needed
  type: string;
  updated_at: string;
  user_id: string;
  group?: string;
  query?: string;
  description?: string;
  thumbnail_url?: string;
  data_reference_year?: number;
}