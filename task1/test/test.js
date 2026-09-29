/**
 * @jest-environment jsdom
 */
import { dragndrop } from '../dragndrop.js';

function mouseEvent(type, pageX = 0, pageY = 0) {
  return { type, pageX, pageY };
}

function makeBox() {
  const parent = document.createElement('div');
  const box = document.createElement('button');
  box.style.position = 'absolute';
  parent.appendChild(box);
  document.body.appendChild(parent);
  return box;
}

test('box moves on mousemove during drag, not before/after', () => {

  const box = makeBox();
  const dd = dragndrop(box);
  dd.next();

  const before = { left: box.style.left, top: box.style.top };

  dd.next(mouseEvent('mousemove', 1, 1));
  expect(box.style.left).toBe(before.left);
  expect(box.style.top).toBe(before.top);

  dd.next(mouseEvent('mousedown', 10, 10));
  dd.next(mouseEvent('mousemove', 20, 20));
  const afterFirstMove = { left: box.style.left, top: box.style.top };
  expect(afterFirstMove).not.toEqual(before);

  dd.next(mouseEvent('mousemove', 30, 30));
  const afterSecondMove = { left: box.style.left, top: box.style.top };
  expect(afterSecondMove).not.toEqual(afterFirstMove);

  dd.next(mouseEvent('mouseup', 30, 30));
  dd.next(mouseEvent('mousemove', 999, 999));
  expect(box.style.left).toBe(afterSecondMove.left);
  expect(box.style.top).toBe(afterSecondMove.top);
});
