#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'Docs');
const outputFile = path.join(__dirname, 'graph-data.json');

const homeBtnHtml = '<a href="/" class="doc-home-btn" title="Back to home">Home</a>';

function addHomeButtonToDocs() {
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
        const filePath = path.join(docsDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        if (!content.includes('doc-home-btn')) {
            content = content.replace('<body>', '<body>\n' + homeBtnHtml);
            fs.writeFileSync(filePath, content);
        }
    });
    
    console.log('Added home button to doc pages');
}

function generateGraph() {
    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));
    
    if (files.length === 0) {
        console.log('No HTML files found in Docs/');
        return;
    }
    
    const fileToIndex = {};
    files.forEach((file, index) => {
        fileToIndex[file] = index;
    });
    
    const links = [];
    
    files.forEach((file) => {
        const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
        
        const hrefRegex = /href="([^"#]+)(?:#[^"]*)?"/g;
        let match;
        
        while ((match = hrefRegex.exec(content)) !== null) {
            const href = match[1];
            
            if (href.startsWith('http') || href.startsWith('mailto') || href === 'style.css') {
                continue;
            }
            
            const normalizedHref = href.replace(/^\.\//, '');
            
            if (fileToIndex[normalizedHref] !== undefined) {
                const sourceIdx = fileToIndex[file];
                const targetIdx = fileToIndex[normalizedHref];
                
                if (sourceIdx !== targetIdx) {
                    links.push({ source: sourceIdx, target: targetIdx });
                }
            }
        }
    });
    
    const uniqueLinks = new Set();
    const dedupedLinks = links.filter(l => {
        const key = `${Math.min(l.source, l.target)}-${Math.max(l.source, l.target)}`;
        if (uniqueLinks.has(key)) return false;
        uniqueLinks.add(key);
        return true;
    });
    
    const graphData = {
        nodes: files.map((file, i) => ({ id: i, file })),
        links: dedupedLinks
    };
    
    fs.writeFileSync(outputFile, JSON.stringify(graphData, null, 2));
    
    console.log(`Generated ${outputFile}`);
    console.log(`  Nodes: ${files.length}`);
    console.log(`  Edges: ${dedupedLinks.length}`);
}

addHomeButtonToDocs();
generateGraph();