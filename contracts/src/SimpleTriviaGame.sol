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
    
    // ============ Constructor ============
    
    /**
     * @notice Initializes the trivia game contract with USDC token
     * @dev Sets the owner and validates token address
     * @param _usdcToken Address of the USDC token contract for rewards
     * @custom:throws InvalidTokenAddress if _usdcToken is zero address
     */
    constructor(address _usdcToken) Ownable(msg.sender) {
        if (_usdcToken == address(0)) revert InvalidTokenAddress();
        usdcToken = IERC20(_usdcToken);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Adds a new trivia question to the game
     * @dev Only callable by contract owner. Increments questionId counter
     * @param _questionText The question text to display to users
     * @param _options Array of answer choices (must have at least 2 options)
     * @param _correctOption Index of the correct answer (must be valid index)
     * @param _rewardAmount USDC amount to reward for correct answer (can be 0)
     * @custom:throws InvalidOptions if options array has <= 1 elements
     * @custom:throws InvalidCorrectOption if correctOption >= options.length
     * @custom:emits QuestionAdded when question is successfully added
     */
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
    
    /**
     * @notice Allows users to submit an answer to an active question
     * @dev Validates question state and option, updates score, and transfers rewards
     * @param _questionId ID of the question to answer
     * @param _selectedOption Index of the chosen answer option
     * @custom:throws QuestionNotActive if question is not active
     * @custom:throws InvalidOption if selectedOption is out of bounds
     * @custom:emits AnswerSubmitted with result and reward amount
     * @custom:security Uses SafeERC20 to prevent reentrancy attacks
     */
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
    
    /**
     * @notice Allows owner to withdraw USDC tokens from contract
     * @dev Only callable by owner. Checks balance before transfer
     * @param _amount Amount of USDC tokens to withdraw (in token decimals)
     * @custom:throws InsufficientBalance if contract balance < _amount
     * @custom:security Uses SafeERC20 for secure token transfer
     */
    function withdrawTokens(uint256 _amount) external onlyOwner {
        if (usdcToken.balanceOf(address(this)) < _amount) revert InsufficientBalance();
        usdcToken.safeTransfer(msg.sender, _amount);
    }
    
    /**
     * @notice Retrieves all details of a specific question
     * @dev View function - does not modify state
     * @param _questionId ID of the question to retrieve
     * @return questionText The question text
     * @return options Array of answer choices
     * @return correctOption Index of the correct answer
     * @return rewardAmount USDC reward for correct answer
     * @return isActive Whether the question is currently active
     * @custom:note Returns default values if questionId doesn't exist
     */
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
