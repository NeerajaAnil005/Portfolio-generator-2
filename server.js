const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/deploy", async (req, res) => {
  const { repoName, htmlContent } = req.body;

  try {
    // Create GitHub repository
    const repoResponse = await axios.post(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        private: false
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    const repoFullName = repoResponse.data.full_name;

    // Upload index.html
    await axios.put(
      `https://api.github.com/repos/${repoFullName}/contents/index.html`,
      {
        message: "Initial portfolio commit",
        content: Buffer.from(htmlContent).toString("base64")
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    res.json({
      success: true,
      url: `https://${repoFullName.split("/")[0]}.github.io/${repoName}`
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Deployment failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});