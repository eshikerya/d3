{{## def.coerceType:
  {{
    var $dataType = 'dataType' + $lvl
      , $coerced = 'coerced' + $lvl;
  }}
  var {{=$dataType}} = typeof {{=$data}};
  {{? it.opts.coerceTypes == 'array'}}
    if ({{=$dataType}} == 'object' && Array.isArray({{=$data}})) {{=$dataType}} = 'array';
  {{?}}

  var {{=$coerced}} = undefined;

  {{ var $bracesCoercion = ''; }}
  {{~ $coerceToTypes:$type:$i }}
    {{? $i }}
      if ({{=$coerced}} === undefined) {
      {{ $bracesCoercion += '}'; }}
    {{?}}

    {{? it.opts.coerceTypes == 'array' && $type != 'array' }}
      if ({{=$dataType}} == 'array' && {{=$data}}.length == 1) {
        {{=$coerced}} = {{=$data}} = {{=$data}}[0];
        {{=$dataType}} = typeof {{=$data}};
        /*if ({{=$dataType}} == 'object' && Array.isArray({{=$data}})) {{=$dataType}} = 'array';*/
      }
    {{?}}

    {{? $type == 'string' }}
      if ({{=$dataType}} == 'number' || {{=$dataType}} == 'boolean')
        {{=$coerced}} = '' + {{=$data}};
      else if ({{=$data}} === null) {{=$coerced}} = '';
    {{?? $type == 'number' || $type == 'integer' }}
      if ({{=$dataType}} == 'boolean' || {{=$data}} === null
          || ({{=$dataType}} == 'string' && {{=$data}} && {{=$data}} == +{{=$data}}
          {{? $type == 'integer' }} && !({{=$data}} % 1){{?}}))
        {{=$coerced}} = +{{=$data}};
    {{?? $type == 'boolean' }}
      if ({{=$data}} === 'false' || {{=$data}} === 0 || {{=$data}} === null)
        {{=$coerced}} = false;
      else if ({{=$data}} === 'true' || {{=$data}} === 1)
        {{=$coerced}} = true;
    {{?? $type == 'null' }}
      if ({{=$data}} === '' || {{=$data}} === 0 || {{=$data}} === false)
        {{=$coerced}} = null;
    {{?? it.opts.coerceTypes == 'array' && $type == 'array' }}
      if ({{=$dataType}} == 'string' || {{=$dataType}} == 'number' || {{=$dataType}} == 'boolean' || {{=$data}} == null)
        {{=$coerced}} = [{{=$data}}];
    {{?}}
  {{~}}

  {{= $bracesCoercion }}

  if ({{=$coerced}} === undefined) {
    {{# def.error:'type' }}
  } else {
    {{# def.setParentData }}
    {{=$data}} = {{=$coerced}};
    {{? !$dataLvl }}if ({{=$parentData}} !== undefined){{?}}
      {{=$parentData}}[{{=$parentDataProperty}}] = {{=$coerced}};
  }
#}}
{{# def.definitions }}

{{## def._error:_rule:
  {{ 'istanbul ignore else'; }}
  {{? it.createErrors !== false }}
    {
      keyword: '{{= $errorKeyword || _rule }}'
      , dataPath: (dataPath || '') + {{= it.errorPath }}
      , schemaPath: {{=it.util.toQuotedString($errSchemaPath)}}
      , params: {{# def._errorParams[_rule] }}
      {{? it.opts.messages !== false }}
        , message: {{# def._errorMessages[_rule] }}
      {{?}}
      {{? it.opts.verbose }}
        , schema: {{# def._errorSchemas[_rule] }}
        , parentSchema: validate.schema{{=it.schemaPath}}
        , data: {{=$data}}
      {{?}}
    }
  {{??}}
    {}
  {{?}}
#}}


{{## def._addError:_rule:
  if (vErrors === null) vErrors = [err];
  else vErrors.push(err);
  errors++;
#}}


{{## def.addError:_rule:
  var err = {{# def._error:_rule }};
  {{# def._addError:_rule }}
#}}


{{## def.error:_rule:
  {{# def.beginDefOut}}
    {{# def._error:_rule }}
  {{# def.storeDefOut:__err }}

  {{? !it.compositeRule && $breakOnError }}
    {{ 'istanbul ignore if'; }}
    {{? it.async }}
      throw new ValidationError([{{=__err}}]);
    {{??}}
      validate.errors = [{{=__err}}];
      return false;
    {{?}}
  {{??}}
    var err = {{=__err}};
    {{# def._addError:_rule }}
  {{?}}
#}}


{{## def.extraError:_rule:
  {{# def.addError:_rule}}
  {{? !it.compositeRule && $breakOnError }}
    {{ 'istanbul ignore if'; }}
    {{? it.async }}
      throw new ValidationError(vErrors);
    {{??}}
      validate.errors = vErrors;
      return false;
    {{?}}
  {{?}}
#}}


{{## def.checkError:_rule:
  if (!{{=$valid}}) {
    {{# def.error:_rule }}
  }
#}}


{{## def.resetErrors:
  errors = {{=$errs}};
  if (vErrors !== null) {
    if ({{=$errs}}) vErrors.length = {{=$errs}};
    else vErrors = null;
  }
#}}


{{## def.concatSchema:{{?$isData}}' + {{=$schemaValue}} + '{{??}}{{=$schema}}{{?}}#}}
{{## def.appendSchema:{{?$isData}}' + {{=$schemaValue}}{{??}}{{=$schema}}'{{?}}#}}
{{## def.concatSchemaEQ:{{?$isData}}' + {{=$schemaValue}} + '{{??}}{{=it.util.escapeQuotes($schema)}}{{?}}#}}

{{## def._errorMessages = {
  $ref:            "'can\\\'t resolve reference {{=it.util.escapeQuotes($schema)}}'",
  additionalItems: "'should NOT have more than {{=$schema.length}} items'",
  additionalProperties: "'should NOT have additional properties'",
  anyOf:           "'should match some schema in anyOf'",
  dependencies:    "'should have {{? $deps.length == 1 }}property {{= it.util.escapeQuotes($deps[0]) }}{{??}}properties {{= it.util.escapeQuotes($deps.join(\", \")) }}{{?}} when property {{= it.util.escapeQuotes($property) }} is present'",
  'enum':          "'should be equal to one of the allowed values'",
  format:          "'should match format \"{{#def.concatSchemaEQ}}\"'",
  _limit:          "'should be {{=$opStr}} {{#def.appendSchema}}",
  _exclusiveLimit: "'{{=$exclusiveKeyword}} should be boolean'",
  _limitItems:     "'should NOT have {{?$keyword=='maxItems'}}more{{??}}less{{?}} than {{#def.concatSchema}} items'",
  _limitLength:    "'should NOT be {{?$keyword=='maxLength'}}longer{{??}}shorter{{?}} than {{#def.concatSchema}} characters'",
  _limitProperties:"'should NOT have {{?$keyword=='maxProperties'}}more{{??}}less{{?}} than {{#def.concatSchema}} properties'",
  multipleOf:      "'should be multiple of {{#def.appendSchema}}",
  not:             "'should NOT be valid'",
  oneOf:           "'should match exactly one schema in oneOf'",
  pattern:         "'should match pattern \"{{#def.concatSchemaEQ}}\"'",
  required:        "'{{? it.opts._errorDataPathProperty }}is a required property{{??}}should have required property \\'{{=$missingProperty}}\\'{{?}}'",
  type:            "'should be {{? $typeIsArray }}{{= $typeSchema.join(\",\") }}{{??}}{{=$typeSchema}}{{?}}'",
  uniqueItems:     "'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)'",
  custom:          "'should pass \"{{=$rule.keyword}}\" keyword validation'",
  patternGroups:   "'should NOT have {{=$moreOrLess}} than {{=$limit}} properties matching pattern \"{{=it.util.escapeQuotes($pgProperty)}}\"'",
  patternRequired: "'should have property matching pattern \\'{{=$missingPattern}}\\''",
  switch:          "'should pass \"switch\" keyword validation'",
  constant:        "'should be equal to constant'",
  _formatLimit:    "'should be {{=$opStr}} \"{{#def.concatSchemaEQ}}\"'",
  _formatExclusiveLimit: "'{{=$exclusiveKeyword}} should be boolean'"
} #}}


{{## def.schemaRefOrVal: {{?$isData}}validate.schema{{=$schemaPath}}{{??}}{{=$schema}}{{?}} #}}
{{## def.schemaRefOrQS: {{?$isData}}validate.schema{{=$schemaPath}}{{??}}{{=it.util.toQuotedString($schema)}}{{?}} #}}

{{## def._errorSchemas = {
  $ref:            "{{=it.util.toQuotedString($schema)}}",
  additionalItems: "false",
  additionalProperties: "false",
  anyOf:           "validate.schema{{=$schemaPath}}",
  dependencies:    "validate.schema{{=$schemaPath}}",
  'enum':          "validate.schema{{=$schemaPath}}",
  format:          "{{#def.schemaRefOrQS}}",
  _limit:          "{{#def.schemaRefOrVal}}",
  _exclusiveLimit: "validate.schema{{=$schemaPath}}",
  _limitItems:     "{{#def.schemaRefOrVal}}",
  _limitLength:    "{{#def.schemaRefOrVal}}",
  _limitProperties:"{{#def.schemaRefOrVal}}",
  multipleOf:      "{{#def.schemaRefOrVal}}",
  not:             "validate.schema{{=$schemaPath}}",
  oneOf:           "validate.schema{{=$schemaPath}}",
  pattern:         "{{#def.schemaRefOrQS}}",
  required:        "validate.schema{{=$schemaPath}}",
  type:            "validate.schema{{=$schemaPath}}",
  uniqueItems:     "{{#def.schemaRefOrVal}}",
  custom:          "validate.schema{{=$schemaPath}}",
  patternGroups:   "validate.schema{{=$schemaPath}}",
  patternRequired: "validate.schema{{=$schemaPath}}",
  switch:          "validate.schema{{=$schemaPath}}",
  constant:        "validate.schema{{=$schemaPath}}",
  _formatLimit:    "{{#def.schemaRefOrQS}}",
  _formatExclusiveLimit: "validate.schema{{=$schemaPath}}"
} #}}


{{## def.schemaValueQS: {{?$isData}}{{=$schemaValue}}{{??}}{{=it.util.toQuotedString($schema)}}{{?}} #}}

{{## def._errorParams = {
  $ref:            "{ ref: '{{=it.util.escapeQuotes($schema)}}' }",
  additionalItems: "{ limit: {{=$schema.length}} }",
  additionalProperties: "{ additionalProperty: '{{=$additionalProperty}}' }",
  anyOf:           "{}",
  dependencies:    "{ property: '{{= it.util.escapeQuotes($property) }}', missingProperty: '{{=$missingProperty}}', depsCount: {{=$deps.length}}, deps: '{{= it.util.escapeQuotes($deps.length==1 ? $deps[0] : $deps.join(\", \")) }}' }",
  'enum':          "{ allowedValues: schema{{=$lvl}} }",
  format:          "{ format: {{#def.schemaValueQS}} }",
  _limit:          "{ comparison: {{=$opExpr}}, limit: {{=$schemaValue}}, exclusive: {{=$exclusive}} }",
  _exclusiveLimit: "{}",
  _limitItems:     "{ limit: {{=$schemaValue}} }",
  _limitLength:    "{ limit: {{=$schemaValue}} }",
  _limitProperties:"{ limit: {{=$schemaValue}} }",
  multipleOf:      "{ multipleOf: {{=$schemaValue}} }",
  not:             "{}",
  oneOf:           "{}",
  pattern:         "{ pattern: {{#def.schemaValueQS}} }",
  required:        "{ missingProperty: '{{=$missingProperty}}' }",
  type:            "{ type: '{{? $typeIsArray }}{{= $typeSchema.join(\",\") }}{{??}}{{=$typeSchema}}{{?}}' }",
  uniqueItems:     "{ i: i, j: j }",
  custom:          "{ keyword: '{{=$rule.keyword}}' }",
  patternGroups:   "{ reason: '{{=$reason}}', limit: {{=$limit}}, pattern: '{{=it.util.escapeQuotes($pgProperty)}}' }",
  patternRequired: "{ missingPattern: '{{=$missingPattern}}' }",
  switch:          "{ caseIndex: {{=$caseIndex}} }",
  constant:        "{}",
  _formatLimit:    "{ comparison: {{=$opExpr}}, limit: {{#def.schemaValueQS}}, exclusive: {{=$exclusive}} }",
  _formatExclusiveLimit: "{}"
} #}}
{{## def.assignDefault:
  if ({{=$passData}} === undefined)
    {{=$passData}} = {{? it.opts.useDefaults == 'shared' }}
                       {{= it.useDefault($sch.default) }}
                     {{??}}
                       {{= JSON.stringify($sch.default) }}
                     {{?}};
#}}


{{## def.defaultProperties:
  {{
    var $schema = it.schema.properties
      , $schemaKeys = Object.keys($schema); }}
  {{~ $schemaKeys:$propertyKey }}
    {{ var $sch = $schema[$propertyKey]; }}
    {{? $sch.default !== undefined }}
      {{ var $passData = $data + it.util.getProperty($propertyKey); }}
      {{# def.assignDefault }}
    {{?}}
  {{~}}
#}}


{{## def.defaultItems:
  {{~ it.schema.items:$sch:$i }}
    {{? $sch.default !== undefined }}
      {{ var $passData = $data + '[' + $i + ']'; }}
      {{# def.assignDefault }}
    {{?}}
  {{~}}
#}}
{{## def.checkMissingProperty:_properties:
  {{~ _properties:_$property:$i }}
    {{?$i}} || {{?}}
    {{ var $prop = it.util.getProperty(_$property); }}
    ( {{=$data}}{{=$prop}} === undefined && (missing{{=$lvl}} = {{= it.util.toQuotedString(it.opts.jsonPointers ? _$property : $prop) }}) )
  {{~}}
#}}


{{## def.errorMissingProperty:_error:
  {{
    var $propertyPath = 'missing' + $lvl
      , $missingProperty = '\' + ' + $propertyPath + ' + \'';
    if (it.opts._errorDataPathProperty) {
      it.errorPath = it.opts.jsonPointers
                      ? it.util.getPathExpr($currentErrorPath,  $propertyPath, true)
                      : $currentErrorPath + ' + ' + $propertyPath;
    }
  }}
  {{# def.error:_error }}
#}}

{{## def.allErrorsMissingProperty:_error:
  {{
    var $prop = it.util.getProperty($reqProperty)
      , $missingProperty = it.util.escapeQuotes($reqProperty);
    if (it.opts._errorDataPathProperty) {
      it.errorPath = it.util.getPath($currentErrorPath, $reqProperty, it.opts.jsonPointers);
    }
  }}
  if ({{=$data}}{{=$prop}} === undefined) {
    {{# def.addError:_error }}
  }
#}}
{{## def.setupKeyword:
  {{
    var $lvl = it.level;
    var $dataLvl = it.dataLevel;
    var $schema = it.schema[$keyword];
    var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
    var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
    var $breakOnError = !it.opts.allErrors;
    var $errorKeyword;

    var $data = 'data' + ($dataLvl || '');
    var $valid = 'valid' + $lvl;
    var $errs = 'errs__' + $lvl;
  }}
#}}


{{## def.setCompositeRule:
  {{
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
  }}
#}}


{{## def.resetCompositeRule:
  {{ it.compositeRule = $it.compositeRule = $wasComposite; }}
#}}


{{## def.setupNextLevel:
  {{
    var $it = it.util.copy(it);
    var $closingBraces = '';
    $it.level++;
    var $nextValid = 'valid' + $it.level;
  }}
#}}


{{## def.ifValid:
  {{? $breakOnError }}
    if ({{=$valid}}) {
    {{ $closingBraces += '}'; }}
  {{?}}
#}}


{{## def.ifResultValid:
  {{? $breakOnError }}
    if ({{=$nextValid}}) {
    {{ $closingBraces += '}'; }}
  {{?}}
#}}


{{## def.elseIfValid:
  {{? $breakOnError }}
    {{ $closingBraces += '}'; }}
    else {
  {{?}}
#}}


{{## def.nonEmptySchema:_schema:
  it.util.schemaHasRules(_schema, it.RULES.all)
#}}


{{## def.strLength:
  {{? it.opts.unicode === false }}
    {{=$data}}.length
  {{??}}
    ucs2length({{=$data}})
  {{?}}
#}}


{{## def.willOptimize:
  it.util.varOccurences($code, $nextData) < 2
#}}


{{## def.generateSubschemaCode:
  {{
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
  }}
#}}


{{## def.insertSubschemaCode:
  {{= it.validate($it) }}
  {{ $it.baseId = $currentBaseId; }}
#}}


{{## def._optimizeValidate:
  it.util.varReplace($code, $nextData, $passData)
#}}


{{## def.optimizeValidate:
  {{? {{# def.willOptimize}} }}
    {{= {{# def._optimizeValidate }} }}
  {{??}}
    var {{=$nextData}} = {{=$passData}};
    {{= $code }}
  {{?}}
#}}


{{## def.cleanUp: {{ out = it.util.cleanUpCode(out); }} #}}


{{## def.cleanUpVarErrors: {{ out = it.util.cleanUpVarErrors(out, $async); }} #}}


{{## def.$data:
  {{
    var $isData = it.opts.v5 && $schema && $schema.$data
      , $schemaValue;
  }}
  {{? $isData }}
    var schema{{=$lvl}} = {{= it.util.getData($schema.$data, $dataLvl, it.dataPathArr) }};
    {{ $schemaValue = 'schema' + $lvl; }}
  {{??}}
    {{ $schemaValue = $schema; }}
  {{?}}
#}}


{{## def.$dataNotType:_type:
  {{?$isData}} ({{=$schemaValue}} !== undefined && typeof {{=$schemaValue}} != _type) || {{?}}
#}}


{{## def.check$dataIsArray:
  if (schema{{=$lvl}} === undefined) {{=$valid}} = true;
  else if (!Array.isArray(schema{{=$lvl}})) {{=$valid}} = false;
  else {
#}}


{{## def.beginDefOut:
  {{
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
  }}
#}}


{{## def.storeDefOut:_variable:
  {{
    var _variable = out;
    out = $$outStack.pop();
  }}
#}}


{{## def.dataPath:(dataPath || ''){{? it.errorPath != '""'}} + {{= it.errorPath }}{{?}}#}}

{{## def.setParentData:
  {{
    var $parentData = $dataLvl ? 'data' + (($dataLvl-1)||'') : 'parentData'
      , $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
  }}
#}}

{{## def.passParentData:
  {{# def.setParentData }}
  , {{= $parentData }}
  , {{= $parentDataProperty }}
#}}


{{## def.checkOwnProperty:
  {{? $ownProperties }}
    if (!Object.prototype.hasOwnProperty.call({{=$data}}, {{=$key}})) continue;
  {{?}}
#}}
/** @namespace */
d3.svg = {};d3.behavior.drag = function() {}
/** @typedef {zoomType} */
d3.behavior.zoom = function () {}

/** @typedef {{Array.<number>}} */
var Point;

/**
 * @param {?Point} x
 * @return {zoomType|Point}
 */
d3.behavior.translate = function(x) {}

/**
 * @param {?number} x
 * @return {zoomType|number}
 */
d3.behavior.scale = function(x) {}

/**
 * @param {Array.<number>} x
 * @return {zoomType|Array.<number>}
 */
d3.behavior.scaleExtent = function(x) {}

/**
 * @param {?Point}
 * @return {zoomType|Point}
 */
d3.behavior.center = function(_) {}

/**
 * @param {?Array.<number>}
 * @return {zoomType|Array.<number>|null}
 */
d3.behavior.x = function(z) {}

/**
 * @param {?Array.<number>}
 * @return {zoomType|Array.<number>|null}
 */
d3.behavior.y = function (z) {}

d3_transitionPrototype.ease = function(value) {}/** @namespace */
var d3 = function () {};
/**
 * @param {!Node} src
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveAfter = function(src, node) {}
/**
 * @param {!string} name
 * @param {?string} value
 * @return {boolean}
 */
d3_selectionPrototype.classed = function (name, value) {}
/** @return {boolean} */
d3_selectionPrototype.empty = function() {}
/**
 * @param {!Function} callback
 * @return {Array.<*>}
 */
d3_selectionPrototype.map = function(callback) {}
/**
 * @param {?*} value
 * @return {d3_selectionPrototype|*}
 */
d3_selectionPrototype.datum = function(value) {}
/**
 * @param {!string|Object.<string, function>} type
 * @param {?Function|boolean} listener
 * @param {?boolean} capture
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.on = function(type, listener, capture) {}
/**
 * @param {!string|SVGElement|HTMLElement} name
 * @param {!string|SVGElement|HTMLElement} before
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.insert = function(name, before) {}
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.selectAll = function () {}/** @return {d3_selectionPrototype} */
d3_selectionPrototype.order = function() {}
/**
 * @param {!function (Node, *, number, number)} callback
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.each = function(callback) {}
/** @return {number} */
d3_selectionPrototype.size = function() {}
/** @return {d3_selectionPrototype} */
d3.selection = function () {};

/** @typedef {d3_selectionPrototype} */
var d3_selectionPrototype = d3.selection.prototype = [];
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.select = function () {};
/** @return {d3_transitionPrototype} */
d3_selectionPrototype.transition = function() {}
/**
 * @param {?string} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.text = function(value) {}
/**
 * @param {!string} name
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.append = function(name) {}
/**
 * @param {!string} name
 * @param {?string} value
 * @param {?number} priority
 * @return {*}
 */
d3_selectionPrototype.style = function(name, value, priority) {}
/**
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveOnTop = function(node) {}
/**
 * @param {!string|SVGElement|HTMLElement} name
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.interrupt = function(name) {}/**
 * @param {!string} name
 * @param {?*} value
 * @return {d3_selectionPrototype|*}
 */
d3_selectionPrototype.property = function(name, value) {}
/**
 * @return {{x: number, y: number, width: number, height: number}} */
d3_selectionPrototype.bbox = function () {}
/** @return {Node|null} */
d3_selectionPrototype.node = function() {}
/**
 * @param {!Node} src
 * @param {!Node} node
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.moveBefore = function(src, node) {}
/**
 * @param {!string} name
 * @param {?*} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.attr = function (name, value) {}
/**
 * @param {!Function} callback
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.call = function(callback) {}
/**
 * @param {?string} value
 * @return {d3_selectionPrototype|string}
 */
d3_selectionPrototype.html = function(value) {}
/**
 * @param {?Array.<*>} value
 * @param {?string} key
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.data = function(value, key) {
    /** @type {d3_selectionPrototype} */
    var r = d3.select([]);

    /** @type {d3_selectionPrototype} */
    r.enter = d3.select([]);

    /** @type {d3_selectionPrototype} */
    r.exit = d3.select([]);

    return r;
}
/**
 * @param {!string|function(number, number): boolean}
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.filter = function(filter) {}
/**
 * @param {Function} comparator
 * @return {d3_selectionPrototype}
 */
d3_selectionPrototype.sort = function(comparator) {}
/** @return {d3_selectionPrototype} */
d3_selectionPrototype.remove = function() {}
/** type {Event} */
d3.event.sourceEvent = {};/** @return {Array} */
d3.mouse = function (){}

