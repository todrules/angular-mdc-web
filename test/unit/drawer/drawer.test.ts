import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  MdcDrawerModule,
  MdcListModule,
  MdcIconModule,
  MdcDrawer,
} from '@angular-mdc/web';

describe('MdcDrawer', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcDrawerModule, MdcListModule, MdcIconModule
      ],
      declarations: [
        SimpleTest,
      ]
    });
    TestBed.compileComponents();
  }));

  describe('basic behaviors', () => {
    let testDebugElement: DebugElement;
    let testInstance: MdcDrawer;
    let testComponent: SimpleTest;

    beforeEach(() => {
      fixture = TestBed.createComponent(SimpleTest);
      fixture.detectChanges();

      testDebugElement = fixture.debugElement.query(By.directive(MdcDrawer));
      testInstance = testDebugElement.componentInstance;
      testComponent = fixture.debugElement.componentInstance;
    });

    it('#should have mdc-drawer--permanent', () => {
      expect(testDebugElement.nativeElement.classList).toContain('mdc-drawer--permanent');
    });

    it('#should be closed', () => {
      testComponent.drawer = 'temporary';
      fixture.detectChanges();

      testInstance.close();
      fixture.detectChanges();
      expect(testInstance.isOpen()).toBe(false);
      expect(testInstance.isDrawerPermanent()).toBe(false);
      expect(testInstance.isDrawerPersistent()).toBe(false);
    });

    it('#should be open', () => {
      testComponent.drawer = 'persistent';
      fixture.detectChanges();

      testInstance.open();
      fixture.detectChanges();
      expect(testInstance.isOpen()).toBe(true);
      expect(testInstance.isDrawerPermanent()).toBe(false);
      expect(testInstance.isDrawerTemporary()).toBe(false);
    });

    it('#should be open', () => {
      testInstance.open();
      fixture.detectChanges();
      expect(testInstance.isOpen()).toBe(true);
    });

    it('#should be closed after opened twice in a row', () => {
      testComponent.drawer = 'persistent';
      fixture.detectChanges();

      testInstance.open();
      testInstance.open();
      fixture.detectChanges();
      expect(testInstance.isOpen()).toBe(false);
    });

    it('#should provide drawer width', () => {
      expect(testInstance.getDrawerWidth()).toBeGreaterThanOrEqual(0);
    });

    it('#should not be rtl direction', () => {
      expect(testInstance.isRtl()).toBe(false);
    });

    it('#should be rtl direction', () => {
      testComponent.direction = 'rtl';
      fixture.detectChanges();
      expect(testInstance.isRtl()).toBe(true);
    });

    it('#should be closed after click', () => {
      testComponent.drawer = 'temporary';
      fixture.detectChanges();

      testDebugElement.nativeElement.click();
      fixture.detectChanges();
      expect(testInstance.isOpen()).toBe(false);
    });

    it('#should not have fixed class modifier', () => {
      testComponent.isFixed = false;
      fixture.detectChanges();
      expect(testDebugElement.nativeElement.classList).not.toContain('ng-mdc-drawer--fixed');
    });

    it('#should have fixed class modifier', () => {
      testComponent.isFixed = true;
      fixture.detectChanges();
      expect(testDebugElement.nativeElement.classList).toContain('ng-mdc-drawer--fixed');
    });
  });
});

@Component({
  template: `
  <mdc-drawer [drawer]="drawer" [fixed]="isFixed" [closeOnClick]="isCloseOnClick"
   [fixedAdjustElement]="testcontent" [direction]="direction">
    <mdc-drawer-spacer>Angular MDC</mdc-drawer-spacer>
    <mdc-drawer-header>
      <mdc-drawer-header-content>
        header content
      </mdc-drawer-header-content>
    </mdc-drawer-header>
    <mdc-drawer-content>
      <mdc-list-group>
        <mdc-list>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>home</mdc-icon>Home
          </mdc-list-item>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>star</mdc-icon>Star
          </mdc-list-item>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>send</mdc-icon>Sent Mail
          </mdc-list-item>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>drafts</mdc-icon>Drafts
          </mdc-list-item>
        </mdc-list>
        <mdc-list-divider></mdc-list-divider>
        <mdc-list>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>email</mdc-icon>All Mail
          </mdc-list-item>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>delete</mdc-icon>Trash
          </mdc-list-item>
          <mdc-list-item>
            <mdc-icon mdc-list-item-start>report</mdc-icon>Spam
          </mdc-list-item>
        </mdc-list>
      </mdc-list-group>
    </mdc-drawer-content>
  </mdc-drawer>
  <div #testcontent></div>
  `,
})
class SimpleTest {
  drawer: string = 'permanent';
  direction: string = 'ltr';
  isFixed: boolean = true;
  isCloseOnClick: boolean = true;
}
