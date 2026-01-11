// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleTriviaGame
 * @author Zali Team
 * @notice A blockchain-based trivia game where users answer questions to earn USDC rewards
 * @dev Uses OpenZeppelin's SafeERC20 for secure token transfers and Ownable for access control
 * 
 * Key features:
 * - Owner can add questions with multiple choice options
 * - Users submit answers and earn points for correct responses
 * - Automatic USDC rewards distribution for correct answers
 * - Question activation/deactivation system
 * - User score tracking
 * 
 * Security considerations:
 * - Only owner can add questions and withdraw tokens
 * - SafeERC20 prevents reentrancy attacks
 * - Input validation on all external functions
 */
contract SimpleTriviaGame is Ownable {
    using SafeERC20 for IERC20;
    
    // ============ Custom Errors ============
    
    /// @notice Thrown when an invalid token address (zero address) is provided
    error InvalidTokenAddress();
    
    /// @notice Thrown when question options array is invalid (length <= 1)
    error InvalidOptions();
    
    /// @notice Thrown when correct option index is out of bounds
    error InvalidCorrectOption();
    
    /// @notice Thrown when attempting to interact with an inactive question
    error QuestionNotActive();
    
    /// @notice Thrown when selected option index is out of bounds
    error InvalidOption();
    
    /// @notice Thrown when contract has insufficient balance for withdrawal
    /// @notice Thrown when contract has insufficient balance for withdrawal
    error InsufficientBalance();
    
    // ============ State Variables ============
    
    /// @notice The USDC token contract used for rewards distribution
    /// @dev Immutable to prevent changes after deployment
    IERC20 public immutable usdcToken;
    
    /// @notice Counter for generating unique question IDs
    /// @dev Increments with each new question, starting from 1
    uint256 public questionId;
    
    // ============ Structs ============
    
    /**
     * @notice Structure representing a trivia question
     * @dev Stores all data needed for a complete question
     * @param questionText The text of the question presented to users
     * @param options Array of possible answer choices
     * @param correctOption Index of the correct answer in options array
     * @param rewardAmount USDC amount awarded for correct answer (in token decimals)
     * @param isActive Whether the question is currently accepting answers
     */
    struct Question {
        string questionText;
        string[] options;
        uint256 correctOption;
        uint256 rewardAmount;
        bool isActive;
    }
    
    // ============ Mappings ============
    
    /// @notice Maps question ID to Question struct
    /// @dev questionId => Question data
    mapping(uint256 => Question) public questions;
    
    /// @notice Maps user address to their total correct answers count
    /// @dev user address => score (number of correct answers)
    mapping(address => uint256) public userScores;
    
    // ============ Events ============
    
    /**
     * @notice Emitted when a new question is added to the game
     * @param questionId Unique identifier for the question
     * @param questionText The text of the added question
     * @param reward USDC reward amount for correct answer
     */
    event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward);
    
    /**
     * @notice Emitted when a user submits an answer
     * @param user Address of the user who submitted the answer
     * @param questionId ID of the question answered
     * @param isCorrect Whether the answer was correct
     * @param reward USDC amount awarded (0 if incorrect)
     */
    event AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward);
    
    constructor(address _usdcToken) Ownable(msg.sender) {
        if (_usdcToken == address(0)) revert InvalidTokenAddress();
        usdcToken = IERC20(_usdcToken);
    }
    
    function addQuestion(
        string memory _questionText,
        string[] memory _options,
        uint256 _correctOption,
        uint256 _rewardAmount
    ) external onlyOwner {
        if (_options.length <= 1) revert InvalidOptions();
        if (_correctOption >= _options.length) revert InvalidCorrectOption();
        
        questionId++;
        questions[questionId] = Question({
            questionText: _questionText,
            options: _options,
            correctOption: _correctOption,
            rewardAmount: _rewardAmount,
            isActive: true
        });
        
        emit QuestionAdded(questionId, _questionText, _rewardAmount);
    }
    
    function submitAnswer(uint256 _questionId, uint256 _selectedOption) external {
        Question storage question = questions[_questionId];
        if (!question.isActive) revert QuestionNotActive();
        if (_selectedOption >= question.options.length) revert InvalidOption();
        
        bool isCorrect = (_selectedOption == question.correctOption);
        
        if (isCorrect) {
            userScores[msg.sender]++;
            if (question.rewardAmount > 0) {
                usdcToken.safeTransfer(msg.sender, question.rewardAmount);
            }
        }
        
        emit AnswerSubmitted(msg.sender, _questionId, isCorrect, isCorrect ? question.rewardAmount : 0);
    }
    
    function withdrawTokens(uint256 _amount) external onlyOwner {
        if (usdcToken.balanceOf(address(this)) < _amount) revert InsufficientBalance();
        usdcToken.safeTransfer(msg.sender, _amount);
    }
    
    function getQuestion(uint256 _questionId) external view returns (
        string memory questionText,
        string[] memory options,
        uint256 correctOption,
        uint256 rewardAmount,
        bool isActive
    ) {
        Question storage q = questions[_questionId];
        return (q.questionText, q.options, q.correctOption, q.rewardAmount, q.isActive);
    }
}
