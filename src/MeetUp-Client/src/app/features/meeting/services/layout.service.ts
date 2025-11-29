import { Injectable } from '@angular/core';
import { DimensionModel } from '../models/dimension.model';
import { GridInputModel } from '../models/grid-input.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  calculateGridDimension(input: GridInputModel): DimensionModel {
    const { dimension, totalGrids, aspectRatio } = input;
    let bestLayout = {
      area: 0,
      width: 0,
      height: 0,
      cols: 0,
      rows: 0,
    };

    if (totalGrids === 0) {
      return { width: 0, height: 0 };
    }

    for (let cols = 1; cols <= totalGrids; cols++) {
      const rows = Math.ceil(totalGrids / cols);

      // Calculate width and height based on container width
      const widthFromContainerWidth = dimension.width / cols;
      const heightFromContainerWidth = widthFromContainerWidth / aspectRatio;

      if (heightFromContainerWidth * rows <= dimension.height) {
        const area = widthFromContainerWidth * heightFromContainerWidth;
        if (area > bestLayout.area) {
          bestLayout = {
            area,
            width: widthFromContainerWidth,
            height: heightFromContainerWidth,
            cols,
            rows,
          };
        }
      }

      // Calculate width and height based on container height
      const heightFromContainerHeight = dimension.height / rows;
      const widthFromContainerHeight = heightFromContainerHeight * aspectRatio;

      if (widthFromContainerHeight * cols <= dimension.width) {
        const area = widthFromContainerHeight * heightFromContainerHeight;
        if (area > bestLayout.area) {
          bestLayout = {
            area,
            width: widthFromContainerHeight,
            height: heightFromContainerHeight,
            cols,
            rows,
          };
        }
      }
    }

    return {
      width: Math.round(bestLayout.width * 100) / 100,
      height: Math.round(bestLayout.height * 100) / 100,
    };
  }
}
