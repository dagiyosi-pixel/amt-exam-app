import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import zlib from 'zlib';

console.log('Building standalone Windows .EXE...');

// 1. Read master offline HTML
const htmlContent = fs.readFileSync('AMT_Exam_Windows.html', 'utf8');

// 2. Compress HTML with gzip and encode to Base64
const compressed = zlib.gzipSync(Buffer.from(htmlContent, 'utf8'));
const base64Data = compressed.toString('base64');

// 3. Write C# Source code
const csharpSource = `using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Windows.Forms;

namespace AMTExamApp
{
    static class Program
    {
        private const string EmbeddedBase64 = "${base64Data}";

        [STAThread]
        static void Main()
        {
            try
            {
                // Create dedicated app directory in LocalAppData
                string appDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AMT_Exam_Prep");
                if (!Directory.Exists(appDir))
                {
                    Directory.CreateDirectory(appDir);
                }

                string htmlFilePath = Path.Combine(appDir, "AMT_Exam_Master.html");

                // Always write / update fresh offline bundle
                byte[] compressedBytes = Convert.FromBase64String(EmbeddedBase64);
                using (MemoryStream msIn = new MemoryStream(compressedBytes))
                using (GZipStream gzip = new GZipStream(msIn, CompressionMode.Decompress))
                using (MemoryStream msOut = new MemoryStream())
                {
                    gzip.CopyTo(msOut);
                    byte[] decompressedBytes = msOut.ToArray();
                    File.WriteAllBytes(htmlFilePath, decompressedBytes);
                }

                // Launch in standalone Native App Mode using Edge or Chrome
                string targetArg = "--app=\\"" + htmlFilePath + "\\"";

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "msedge.exe",
                    Arguments = targetArg,
                    UseShellExecute = true
                };

                try
                {
                    Process.Start(psi);
                    return;
                }
                catch
                {
                    // Fallback to Chrome
                    psi.FileName = "chrome.exe";
                    try
                    {
                        Process.Start(psi);
                        return;
                    }
                    catch
                    {
                        // Fallback to default browser
                        Process.Start(htmlFilePath);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error launching AMT Exam App: " + ex.Message, "AMT Exam Master", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
`;

fs.writeFileSync('AMT_Launcher.cs', csharpSource, 'utf8');

// 4. Compile with csc.exe
const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
const compileCmd = `"${cscPath}" /target:winexe /optimize+ /out:AMT_Exam_App.exe AMT_Launcher.cs`;

console.log('Compiling C# into native Windows binary...');
execSync(compileCmd, { stdio: 'inherit' });

// 5. Copy to Desktop & deliverables
const desktopExe = 'C:\\Users\\Dagi 3\\Desktop\\AMT_Exam_App.exe';
fs.copyFileSync('AMT_Exam_App.exe', desktopExe);

console.log('✅ Successfully compiled native Windows EXE:');
console.log(' - ' + desktopExe);
console.log('Size:', (fs.statSync('AMT_Exam_App.exe').size / 1024).toFixed(1), 'KB');
