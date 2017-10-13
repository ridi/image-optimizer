.PHONY: help
	

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


install:
	npm install


install-production:
	npm install --only=production


clear:
	rm -r node_modules


deploy-production: clear install-production
	sls deploy -s production


deploy-dev: clear install
	sls deploy -s dev

