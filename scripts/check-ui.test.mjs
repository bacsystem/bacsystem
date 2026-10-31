import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTokenParity, checkTemplates, checkIconUsage, checkInlineStyles } from './check-ui.mjs';

test('checkTokenParity names a token missing from the dark theme', () => {
  const css = `:root { --color-text: #111; --color-bg: #fff; }
[data-theme='dark'] { --color-bg: #000; }`;
  const errors = checkTokenParity(css);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /--color-text/);
});

test('checkTokenParity returns [] when both blocks match', () => {
  const css = `:root { --color-text: #111; --color-bg: #fff; --space-1: 4px; }
[data-theme='dark'] { --color-text: #eee; --color-bg: #000; }`;
  assert.deepEqual(checkTokenParity(css), []);
});

test('checkTemplates flags literal design values in inline styles', () => {
  const errors = checkTemplates([
    { path: 'a.html', content: '<div style="color:#fff"></div>' },
    { path: 'b.html', content: '<div style="margin: 12px"></div>' },
  ]);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /a\.html/);
  assert.match(errors[1], /b\.html/);
});

test('checkTemplates accepts custom-property styles', () => {
  const errors = checkTemplates([
    { path: 'a.html', content: '<li style="--i: 2"></li><li [style.--i]="idx"></li>' },
  ]);
  assert.deepEqual(errors, []);
});

test('checkIconUsage flags bi classes outside the icon component', () => {
  const files = [
    { path: 'src/app/x/x.component.html', content: '<i class="bi bi-star"></i>' },
    { path: 'src/app/shared/ui/icon/icon.component.html', content: '<i class="bi bi-star"></i>' },
  ];
  const errors = checkIconUsage(files);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /x\.component\.html/);
});

test('checkInlineStyles flags inline styles arrays and template literals', () => {
  const errors = checkInlineStyles([
    { path: 'a.component.ts', content: "@Component({ styles: ['a{}'] }) class A {}" },
    { path: 'b.component.ts', content: '@Component({ styles: `a{}` }) class B {}' },
    { path: 'c.component.ts', content: "@Component({ styles : ['a{}'] }) class C {}" },
  ]);
  assert.equal(errors.length, 3);
});

test('checkInlineStyles passes styleUrl and ignores specs', () => {
  assert.deepEqual(
    checkInlineStyles([
      { path: 'a.component.ts', content: "@Component({ styleUrl: './a.css' }) class A {}" },
      { path: 'a.spec.ts', content: "TestBed.overrideComponent(A, { set: { styles: ['a{}'] } })" },
    ]),
    [],
  );
});
