/* global describe, it */
'use strict';
var hbx = require('../');
var assert = require('assert');


describe('hbx', function(){
    
    describe('registerLayout', function(){
        
        it('has a layouts object', function(){
           assert(typeof hbx.layouts !== 'undefined'); 
        });
        
        it('should allow layouts to be added', function(){
           var tmpl = '<div class="base">{{{content}}}</div>';
           hbx.registerLayout('base', tmpl);           
           assert.equal(hbx.layouts['base'], tmpl);
        });
    });
    
    describe('unregisterLayout', function(){
        
       it('should allow layouts to be unregistered', function(){           
           hbx.registerLayout('base', 'something');       
           hbx.unregisterLayout('base');           
           assert.equal(hbx.layouts['base'], undefined);
       });
    });
    
    describe('compile (mokey patched)', function(){

        describe('with no layout defined', function(){
           
            it('should render normally', function(){                
                var template = hbx.compile('<div>hello</div>');            
                assert.equal(template({}), '<div>hello</div>');
            });
            
            it('should render normally with global partial', function(){                     
                hbx.registerPartial('span', '<span>world</span>');                
                var template = hbx.compile('<div>hello {{>span}}</div>');            
                assert.equal(template({}), '<div>hello <span>world</span></div>');
            });
            
            it('should render normally with local partial', function(){
                var template = hbx.compile('<div>hello {{>span}}</div>');            
                assert.equal(template({ partials: { span: '<span>world</span>' } }), '<div>hello <span>world</span></div>');
            });
        });

        describe('with layout defined', function(){
            
            it('should strip empty whitespace after the layout declaration', function(){
                
                var template = hbx.compile('{{! layout: root }}\n');
                hbx.registerLayout('root', '{{{content}}}');
                assert.equal(template({}), '');
            });
            
            it('should nest template in global layout', function(){
                
                var template = hbx.compile('{{! layout: root }}\nhello');
                hbx.registerLayout('root', '<div>{{{content}}}</div>');
                assert.equal(template({}), '<div>hello</div>');
            });
            
            it('should nest template in local layout', function(){
                
                var root = '<div>{{{content}}}</div>';
                var template = hbx.compile('{{! layout: root }}\nhello');
                assert.equal(template({ layouts: { root: root } }), '<div>hello</div>');
            });
            
            it('should nest layouts within layouts', function(){
                                
                var template = hbx.compile('{{! layout: three }}\nhello');                
                hbx.registerLayout('one', '<div class="one">{{{content}}}</div>');
                hbx.registerLayout('two', '{{! layout: one }}<div class="two">{{{content}}}</div>');
                hbx.registerLayout('three', '{{! layout: two }}<div class="three">{{{content}}}</div>');
                assert.equal(template({}), '<div class="one"><div class="two"><div class="three">hello</div></div></div>');
            });
            
        });
    });
    
    describe('precompile (mokey patched)', function(){
       
       it('should throw when called', function(){
          assert.throws(function(){ hbx.precompile('test'); }); 
       });
    });
});
