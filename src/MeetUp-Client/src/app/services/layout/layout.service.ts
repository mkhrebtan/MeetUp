import {Injectable} from '@angular/core';
import {VideoLayoutModel} from '../../models/video-layout.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  calculateOptimalMeetingGridLayout(
    containerWidth: number,
    containerHeight: number,
    participantCount: number,
    aspectRatio: number = 16 / 9,
    gap: number = 0
  ): VideoLayoutModel {
    let maxWidth = 0;

    for (let width = 1; width <= containerWidth; width++) {
      if (!this.canFitCards(width, aspectRatio, containerWidth, containerHeight, participantCount, gap)) {
        maxWidth = width - 1;
        break;
      }
    }

    maxWidth = maxWidth || containerWidth;

    const cardWidth = Math.floor(maxWidth) - gap;
    const cardHeight = Math.floor(cardWidth / aspectRatio) - gap;

    return {cardWidth, cardHeight};
  }

  private canFitCards(
    cardWidth: number,
    aspectRatio: number,
    containerWidth: number,
    containerHeight: number,
    participantCount: number,
    gap: number
  ): boolean {
    const cardHeight = cardWidth / aspectRatio;
    const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));

    if (!cardsPerRow) return false;

    const rowsNeeded = Math.ceil(participantCount / cardsPerRow);
    const totalHeight = rowsNeeded * cardHeight + (rowsNeeded - 1) * gap;

    return totalHeight <= containerHeight;
  }
}
