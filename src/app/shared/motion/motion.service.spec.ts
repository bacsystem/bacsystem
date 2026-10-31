import { NgZone, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MotionService } from './motion.service';

describe('MotionService', () => {
  function create(platform: 'browser' | 'server' = 'browser'): MotionService {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: platform }] });
    return TestBed.inject(MotionService);
  }

  it('is disabled on the server', () => {
    expect(create('server').enabled).toBeFalse();
  });

  it('is disabled with prefers-reduced-motion: reduce', () => {
    const mm = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    expect(create().enabled).toBeFalse();
    expect(mm).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('is enabled in a browser that welcomes motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    expect(create().enabled).toBeTrue();
  });

  it('never matches media queries on the server', () => {
    const mm = spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    expect(create('server').matches('(min-width: 64em)')).toBeFalse();
    expect(mm).not.toHaveBeenCalled();
  });

  it('runs work outside the Angular zone', () => {
    const motion = create();
    const zone = TestBed.inject(NgZone);
    const inside = zone.run(() => motion.run(() => NgZone.isInAngularZone()));
    expect(inside).toBeFalse();
  });

  it('animates outside the Angular zone and can be stopped', () => {
    const motion = create();
    const zone = TestBed.inject(NgZone);
    const el = document.createElement('div');
    document.body.appendChild(el);
    const spy = spyOn(motion, 'run').and.callThrough();
    const controls = zone.run(() => motion.animate(el, { opacity: [0, 1] }, { duration: 0.2 }));
    expect(spy).toHaveBeenCalled();
    expect(() => controls.stop()).not.toThrow();
    el.remove();
  });
});
