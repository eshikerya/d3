GENERATED_FILES = \
	d3.js \
	d3.min.js \
	bower.json \
	component.json

DEFS = $(shell find . -type f -name '*.def')
# \
# 	./src/start.def \
# 	./src/selection/selection.def \
# 	./src/selection/append.def \
# 	./src/selection/attr.def \
# 	./src/selection/bbox.def \
# 	./src/selection/call.def \
# 	./src/selection/classed.def \
# 	./src/selection/data.def \
# 	./src/selection/datum.def \
# 	./src/selection/each.def \
# 	./src/selection/empty.def \
# 	./src/selection/filter.def \
# 	./src/selection/html.def \
# 	./src/selection/insert.def \
# 	./src/selection/map.def \
# 	./src/selection/move-after.def \
# 	./src/selection/move-before.def \
# 	./src/selection/move-ontop.def \
# 	./src/selection/node.def \
# 	./src/selection/on.def \
# 	./src/selection/order.def \
# 	./src/selection/property.def \
# 	./src/selection/remove.def \
# 	./src/selection/select.def \
# 	./src/selection/selectAll.def \
# 	./src/selection/size.def \
# 	./src/selection/sort.def \
# 	./src/selection/style.def \
# 	./src/selection/text.def \
# 	./src/selection/transition.def \
# 	./src/behavior/zoom.def \
# 	./src/svg/svg.def \
# 	./src/svg/cLink.def

#

all: $(GENERATED_FILES) d3.externs.js

.PHONY: clean all test

test:
	@npm test

src/start.js: package.json bin/start
	bin/start > $@

d3.js: $(shell node_modules/.bin/smash --ignore-missing --list src/d3.js) package.json
	@rm -f $@
	node_modules/.bin/smash src/d3.js | node_modules/.bin/uglifyjs - -b indent-level=2 -o $@
	@chmod a-w $@

d3.min.js: d3.js bin/uglify
	@rm -f $@
	bin/uglify $< > $@

%.json: bin/% package.json
	@rm -f $@
	bin/$* > $@
	@chmod a-w $@

d3.externs.js: d3.js $(DEFS)
	cat $(DEFS) > $@

clean:
	rm -f -- $(GENERATED_FILES)
