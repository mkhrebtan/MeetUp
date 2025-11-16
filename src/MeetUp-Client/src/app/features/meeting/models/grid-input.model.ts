import {DimensionModel} from "./dimension.model";
import {AspectRatioModel} from "./aspect-ratio.model";

export interface GridInputModel {
  dimension: DimensionModel;
  totalGrids: number;
  aspectRatio: AspectRatioModel;
}
