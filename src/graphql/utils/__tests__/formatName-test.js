import test from 'ava'
import * as formatName from '../formatName'

test('type will format in pascal case', t => {
  t.is(formatName.type('hello_world'), 'HelloWorld')
  t.is(formatName.type('hello-world'), 'HelloWorld')
  t.is(formatName.type('helloWorld'), 'HelloWorld')
  t.is(formatName.type('HelloWorld'), 'HelloWorld')
  t.is(formatName.type('HELLO_WORLD'), 'HelloWorld')
  t.is(formatName.type('_helloWorld'), '_HelloWorld')
  t.is(formatName.type('__hello_world__'), '__HelloWorld__')
  t.is(formatName.type('HELLO_WORLD_'), 'HelloWorld_')
})

test('field will format in camel case', t => {
  t.is(formatName.field('hello_world'), 'helloWorld')
  t.is(formatName.field('hello-world'), 'helloWorld')
  t.is(formatName.field('helloWorld'), 'helloWorld')
  t.is(formatName.field('HelloWorld'), 'helloWorld')
  t.is(formatName.field('HELLO_WORLD'), 'helloWorld')
  t.is(formatName.field('_HelloWorld'), '_helloWorld')
  t.is(formatName.field('__hello_world__'), '__helloWorld__')
  t.is(formatName.field('HELLO_WORLD_'), 'helloWorld_')
})

test('arg will format in camel case', t => {
  t.is(formatName.arg('hello_world'), 'helloWorld')
  t.is(formatName.arg('hello-world'), 'helloWorld')
  t.is(formatName.arg('helloWorld'), 'helloWorld')
  t.is(formatName.arg('HelloWorld'), 'helloWorld')
  t.is(formatName.arg('HELLO_WORLD'), 'helloWorld')
  t.is(formatName.arg('_HelloWorld'), '_helloWorld')
  t.is(formatName.arg('__hello_world__'), '__helloWorld__')
  t.is(formatName.arg('HELLO_WORLD_'), 'helloWorld_')
})

test('enumValue will format in constant case', t => {
  t.is(formatName.enumValue('hello_world'), 'HELLO_WORLD')
  t.is(formatName.enumValue('hello-world'), 'HELLO_WORLD')
  t.is(formatName.enumValue('helloWorld'), 'HELLO_WORLD')
  t.is(formatName.enumValue('HelloWorld'), 'HELLO_WORLD')
  t.is(formatName.enumValue('HELLO_WORLD'), 'HELLO_WORLD')
  t.is(formatName.enumValue('_HelloWorld'), '_HELLO_WORLD')
  t.is(formatName.enumValue('__hello_world__'), '__HELLO_WORLD__')
  t.is(formatName.enumValue('HELLO_WORLD_'), 'HELLO_WORLD_')
})
