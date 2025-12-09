import { PagedList } from '../../../shared/utils/paged-list';
import { Participant } from 'livekit-client';

export class MeetingPagedList extends PagedList<Participant> {
  constructor(items: Participant[], pageSize: number) {
    super(items, pageSize);
  }

  public bringToFront(item: Participant): void {
    const index = this.items().indexOf(item);
    if (index !== -1) {
      this._items.update((items) => {
        const newItems = [...items];
        const [removed] = newItems.splice(index, 1);
        newItems.unshift(removed);
        return newItems;
      });
    }
  }
}
