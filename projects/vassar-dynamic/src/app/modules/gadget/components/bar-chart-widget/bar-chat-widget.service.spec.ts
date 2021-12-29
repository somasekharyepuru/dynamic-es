import { TestBed } from '@angular/core/testing';

import { BarChatWidgetService } from './bar-chat-widget.service';

describe('BarChatWidgetService', () => {
  let service: BarChatWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarChatWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
