const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let inputDir = path.resolve(__dirname, "input");
let outputDir = path.resolve(__dirname, "output");


if(!fs.existsSync(inputDir)){
    fs.mkdirSync(inputDir);
}

// delete output directory
if(fs.existsSync(outputDir)){
    fs.rmSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir);

const convertFolder = (folderPath, outputPath) => {
    let files = fs.readdirSync(folderPath);
    for(let entityName of files){
        let fullPath = path.resolve(folderPath, entityName);
        let fileStat = fs.lstatSync(fullPath);
        let isFile = fileStat.isFile();
        let isDirectory = fileStat.isDirectory();
        if(isDirectory){
            let clonedPath = path.resolve(outputPath, entityName);
            if(!fs.existsSync(clonedPath)){
                fs.mkdirSync(clonedPath);
            }
            convertFolder(fullPath, clonedPath);
            continue;
        }
        if(!isFile){
            continue;
        }
        let fileName = entityName;
        if(!entityName.endsWith(".mov")){
            console.error(entityName, " is not a MOV file.");
            console.log("===============");
            continue;
        }
        let outputFile = path.resolve(outputPath, fileName);
        console.log("Converting -> ", ` "${fullPath}"`);
        console.log("Into -------> ", ` "${outputFile.replace(".mov", ".webm")}"`);
        outputFile = outputFile.replace(".mov", ".webm");
        let cmd = `ffmpeg -i "${fullPath}" -crf 18 "${outputFile}"`;
        let cmdOptions =  { stdio : 'pipe' };
        
        try {
            let stdout = execSync(cmd, cmdOptions);
            console.log("Saved --> ", outputFile);
            console.log("===============");
        } catch (e) {
            console.error("Error ", e.stderr);
        }
    }
};

convertFolder(inputDir, outputDir);