# Academic Doc Generator (学术文档生成器)

**Repository Name Suggestion**: `academic-doc-generator`  
**Description**: A React-based tool for generating and exporting realistic academic document templates (Tuition Statement, Transcript, Schedule) for UI testing, verification flow development, and educational purposes.

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/022122/academic-doc-generator)

## 📖 简介 (Introduction)

这是一个基于 **React** + **Vite** + **HeroUI** 构建的现代化 Web 应用，用于快速生成标准的学术文档模板（包括学费单、成绩单、课程表）。支持一键随机生成仿真数据，并提供多种导出格式（单图拼接、ZIP打包）。

## ✨ 特性 (Features)

*   **现代化 UI**: 采用 [HeroUI (NextUI)](https://heroui.com) 构建，支持暗色模式，界面美观流畅。
*   **一键生成**: 内置 Faker.js，可一键生成逼真的姓名、地址、日期和学籍信息。
*   **多种导出**:
    *   **Horizontal Stitch**: 将三份文档横向拼接为一张长图。
    *   **Grid Stitch**: 网格拼接导出。
    *   **ZIP Archive**: 分别导出三张独立图片并打包为 ZIP。
*   **实时预览**: 所见即所得的文档预览效果。

## 🛠️ 技术栈 (Tech Stack)

*   [React](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [HeroUI](https://heroui.com/)
*   [html2canvas](https://html2canvas.hertzen.com/)
*   [Faker.js](https://fakerjs.dev/)

## 🚀 快速开始 (Quick Start)

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **启动开发服务器**
    ```bash
    npm run dev
    ```

3.  **构建生产版本**
    ```bash
    npm run build
    ```

## ⚠️ 免责声明 (Disclaimer)

**请在使用本软件前仔细阅读以下声明：**

1.  **仅供测试与教育用途**：本项目旨在为开发人员提供用于 UI 测试、布局验证及系统集成的测试数据生成工具。
2.  **严禁用于非法用途**：**严禁**使用本工具生成的文档进行任何形式的欺诈、伪造文件、身份冒充或绕过验证系统（如 SheerID、Unidays 等）。
3.  **无有效性**：本工具生成的文档均为虚构模版，不具备任何法律效力或官方认证效力。
4.  **免责条款**：作者不对任何人使用本软件产生的任何后果负责。使用本软件即表示您同意承担所有因使用该软件而产生的法律责任和风险。

**Please read carefully before using this software:**

This tool is intended for **educational and testing purposes only** (e.g., testing UI layouts, verifying upload flows). **DO NOT** use this tool to create fraudulent documents, misrepresent your identity, or bypass verification systems. The generated documents are fictitious and have no legal validity. The authors assume no liability for any misuse of this software.

## 📄 License

本项目采用 [MIT License](LICENSE) 开源，但使用需遵守上述免责声明。

