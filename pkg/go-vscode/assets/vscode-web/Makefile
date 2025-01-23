.PHONY: vscode vscode-web vscode-web-patched vscode-web-artifact vscode-web-patched-artifact

VERSION=1.92.1

vscode-web-patched: 
	rm -rf ./dist && mkdir -p ./dist/vscode	
	docker build -t vscode-web ./patched --build-arg VERSION=$(VERSION)
	docker run --rm -v ./dist/vscode:/dist vscode-web
	cp ./patched/index.html ./dist
	cp ./patched/workbench.json ./dist

vscode-web: 
	rm -rf ./dist && mkdir -p ./dist/vscode	
	docker build -t vscode-web . --build-arg VERSION=$(VERSION)
	docker run --rm -v ./dist/vscode:/dist vscode-web
	cp index.html ./dist

vscode-web-artifact: vscode-web
	zip -r vscode-web-1.92.1.zip ./dist

vscode-web-patched-artifact: vscode-web-patched
	zip -r vscode-web-1.92.1-patched.zip ./dist

vscode:
	git clone --depth 1 https://github.com/microsoft/vscode.git -b $(VERSION)