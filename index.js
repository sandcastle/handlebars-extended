'use strict';
var handlebars = require('handlebars');
var _ = require('lodash');

// hold layouts
handlebars.layouts = {};

/**
 * Registers a global layout.
 */
handlebars.registerLayout = function(name, layout){
    
    if (typeof layout === 'undefined') {
        throw new Error('Attempting to register a layout as undefined');
    }
	handlebars.layouts[name] = layout;
}

/**
 * Unregisters a global layout.
 */
handlebars.unregisterLayout = function(name){
    delete handlebars.layouts[name];
};

// cache original call so we can patch
var originalCompile = handlebars.compile;

var layoutNameRegex  = /^\s*{\{\!\slayout:\s*([^\s]+)\s*\}\}/i;
var layoutRegex  = /^(\s*{\{\!\slayout:\s*[^\s]+\s*\}\}\s*)/mi;
var contentRegex = /(\{\{\{content\}\}\})/mi;

/**
 * Monkey patch the compile function.
 */
handlebars.compile = function(tmpl, compileOpts){

    var meta = check(tmpl);
    var compiled = originalCompile(meta.tmpl);
    
    return function render(){        
        return meta.layout ? renderNested.apply(this, arguments) : compiled.apply(this, arguments);
    };
    
    function renderNested(data, options){
        
        var layouts = _.assign(handlebars.layouts, options.layouts || {});        
        return renderLayout(data, options, layouts, meta.layout, compiled(data, options));
    }
    
    function renderLayout(data, options, layouts, name, inner){
        
        if (!name || !layouts[name]){
            return inner;
        }
        
        var layout = layouts[name].replace(contentRegex, inner);
        var compiledLayout = handlebars.compile(layout, compileOpts);
        
        return compiledLayout(data, options);
    }
    
    function check(child){
        
        var def = layoutNameRegex.exec(child);
        if (!def){
            return { tmpl: child };
        }
        
        return {
            layout: def[1],
            tmpl: child.replace(layoutRegex, '')
        }
    }
};

/**
 * Disable precompile.
 */
handlebars.precompile = function(){
    throw new Error('precompile is not currently supported by hbx!');
}

module.exports = handlebars;
