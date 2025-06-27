const blogService = require("./blog.service");

// Blog Category Controllers
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await blogService.getBlogCategories();
    res.status(200).json({
      success: true,
      message: "Blog categories retrieved successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await blogService.getBlogCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Blog category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addBlogCategory = async (req, res) => {
  try {
    const category = await blogService.addBlogCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Blog category added successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await blogService.updateBlogCategory(id, req.body);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Blog category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await blogService.deleteBlogCategory(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Blog category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Blog Topic Controllers
exports.getBlogTopics = async (req, res, next) => {
  try {
    const topics = await blogService.getBlogTopics();
    res.status(200).json({
      success: true,
      message: "Blog topics retrieved successfully",
      data: topics,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await blogService.getBlogTopicById(id);
    if (!topic) {
      return res
        .status(404)
        .json({ success: false, message: "Blog topic not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog topic retrieved successfully",
      data: topic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addBlogTopic = async (req, res) => {
  try {
    const topic = await blogService.addBlogTopic(req.body);
    res.status(201).json({
      success: true,
      message: "Blog topic added successfully",
      data: topic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlogTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTopic = await blogService.updateBlogTopic(id, req.body);
    if (!updatedTopic) {
      return res
        .status(404)
        .json({ success: false, message: "Blog topic not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog topic updated successfully",
      data: updatedTopic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlogTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTopic = await blogService.deleteBlogTopic(id);
    if (!deletedTopic) {
      return res
        .status(404)
        .json({ success: false, message: "Blog topic not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Blog Post Controllers
exports.getBlogPosts = async (req, res, next) => {
  const { page, limit, search, ...filters } = req.query;
  const paginationData = { page: page, limit: limit };
  try {
    const query = {};
    for (const key in filters) {
      query[key] = filters[key];
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await blogService.getBlogPosts(
      query,
      paginationData.page || null,
      paginationData.limit || null
    );

    let response = {
      success: true,
      message: "Blog posts retrieved successfully",
      data: !page && !limit ? posts : posts.data,
    };

    if (posts.total) {
      response.totalItems = posts.total;
      response.pageNumber = Number(posts.page);
      response.totalPages = posts.pages;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await blogService.getBlogPostById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog post retrieved successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await blogService.getBlogPostBySlug(slug);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog post retrieved successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addBlogPost = async (req, res) => {
  try {
    const post = await blogService.addBlogPost(req.body);
    res.status(201).json({
      success: true,
      message: "Blog post added successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await blogService.updateBlogPost(id, req.body);
    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await blogService.deleteBlogPost(id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }
    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
